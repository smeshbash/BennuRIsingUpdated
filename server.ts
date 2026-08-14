import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

dotenv.config();

async function startServer() {
  const app = express();
  // Cloud Run (and most PaaS hosts) inject PORT and require the container to
  // listen on it — 3000 is only a local-dev default now.
  const PORT = process.env.PORT || 3000;

  app.use(cors());

  // Razorpay Initialization
  let razorpay: Razorpay | null = null;
  const getRazorpay = () => {
    if (!razorpay) {
        const key_id = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;

        if (!key_id || !key_secret) {
            throw new Error("Razorpay credentials not set");
        }

        razorpay = new Razorpay({
            key_id: key_id,
            key_secret: key_secret
        });
    }
    return razorpay;
  }

  // Supabase admin client (service role) — server-side only, bypasses RLS.
  // Used exclusively by the webhook handler below, never exposed to the frontend.
  let supabaseAdmin: SupabaseClient | null = null;
  const getSupabaseAdmin = (): SupabaseClient | null => {
    if (!supabaseAdmin) {
        const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !serviceKey) {
            return null;
        }
        supabaseAdmin = createClient(url, serviceKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        });
    }
    return supabaseAdmin;
  }

  // Resend client — sends the donation receipt email after a payment is
  // verified by the webhook below. Optional: if RESEND_API_KEY isn't set,
  // receipts are simply skipped (donations still record fine either way).
  let resend: Resend | null = null;
  const getResend = (): Resend | null => {
    if (!resend) {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) return null;
        resend = new Resend(apiKey);
    }
    return resend;
  }

  // Sends the donor a branded receipt email. Failures here are logged but
  // never thrown — a flaky email provider should never cause the webhook to
  // return a non-2xx (which would make Razorpay retry the whole donation
  // write pointlessly) or block the donor-facing checkout flow in any way.
  const sendDonationReceipt = async (donation: {
    donor_name: string | null;
    donor_email: string | null;
    amount: number;
    fund_id: string | null;
    payment_id: string;
    frequency: string;
    pan_number: string | null;
  }) => {
    try {
      const resendClient = getResend();
      if (!resendClient) {
          console.log("[Receipt] RESEND_API_KEY not set — skipping receipt email");
          return;
      }
      if (!donation.donor_email) {
          console.log("[Receipt] No donor email on this donation — skipping receipt email");
          return;
      }

      // Best-effort friendly fund/wing name — falls back to the raw id if
      // there's no match (e.g. Supabase admin client unavailable, or the
      // fund/wing was renamed or removed since this donation was made).
      let fundName = donation.fund_id || 'General Fund (Where Needed Most)';
      const admin = getSupabaseAdmin();
      if (admin && donation.fund_id) {
          const { data } = await admin.from('donation_funds').select('name').eq('id', donation.fund_id).maybeSingle();
          if (data?.name) fundName = data.name;
      }

      const fromAddress = process.env.RECEIPT_FROM_EMAIL || 'onboarding@resend.dev';
      const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
      const frequencyLabel = donation.frequency === 'monthly' ? 'Monthly Donation (First Installment)' : 'One-Time Donation';
      const taxNote = donation.pan_number
          ? `<p style="color:#4b5563;font-size:13px;">This donation is eligible for tax exemption under Section 80G. Your PAN on file: <strong>${donation.pan_number}</strong>. A formal 80G certificate will follow separately.</p>`
          : '';

      await resendClient.emails.send({
          from: `Bennu Rising International Foundation <${fromAddress}>`,
          to: donation.donor_email,
          subject: `Your donation receipt — ₹${donation.amount}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#1f2937;">
              <h2 style="color:#003F7F;">Thank you, ${donation.donor_name || 'friend'}!</h2>
              <p>Your generosity brings healing and hope. Here's your donation receipt:</p>
              <table style="width:100%;border-collapse:collapse;margin:20px 0;">
                <tr><td style="padding:8px 0;color:#6b7280;">Amount</td><td style="padding:8px 0;text-align:right;font-weight:bold;">₹${donation.amount}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280;">Type</td><td style="padding:8px 0;text-align:right;">${frequencyLabel}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280;">Allocated to</td><td style="padding:8px 0;text-align:right;">${fundName}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280;">Date</td><td style="padding:8px 0;text-align:right;">${dateStr}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280;">Reference ID</td><td style="padding:8px 0;text-align:right;font-family:monospace;font-size:12px;">${donation.payment_id}</td></tr>
              </table>
              ${taxNote}
              <p style="color:#6b7280;font-size:13px;margin-top:24px;">Bennu Rising International Foundation<br/>10/62, Odakkal Sreepatham, Eruva East PO, Kayamkulam, Muthukulam, Karthikappally, Alappuzha, Kerala, India - 690506</p>
            </div>
          `,
      });
      console.log(`[Receipt] Sent donation receipt to ${donation.donor_email} for payment ${donation.payment_id}`);
    } catch (err: any) {
      console.error("[Receipt] Failed to send donation receipt email:", err);
    }
  }

  // --- Razorpay Webhook ---
  // Registered BEFORE express.json() and with its own express.raw() middleware,
  // because signature verification must run over the exact raw request bytes
  // Razorpay signed — re-serialized JSON would produce a different HMAC and
  // always fail verification, even for legitimate requests.
  app.post('/api/webhooks/razorpay', express.raw({ type: '*/*' }), async (req, res) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!webhookSecret) {
            console.error("[Webhook] RAZORPAY_WEBHOOK_SECRET not set — rejecting request");
            return res.status(500).json({ error: "Webhook not configured" });
        }

        const signature = req.headers['x-razorpay-signature'] as string | undefined;
        const rawBody = req.body as Buffer; // Buffer because of express.raw()

        if (!signature) {
            return res.status(400).json({ error: "Missing X-Razorpay-Signature header" });
        }

        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(rawBody)
            .digest('hex');

        // Constant-time comparison to avoid timing attacks
        const signatureBuffer = Buffer.from(signature, 'hex');
        const expectedBuffer = Buffer.from(expectedSignature, 'hex');
        const isValid = signatureBuffer.length === expectedBuffer.length &&
            crypto.timingSafeEqual(signatureBuffer, expectedBuffer);

        if (!isValid) {
            console.error("[Webhook] Signature verification failed — request did not come from Razorpay (or secret is wrong)");
            return res.status(400).json({ error: "Invalid signature" });
        }

        const payload = JSON.parse(rawBody.toString('utf8'));
        console.log(`[Webhook] Verified event: ${payload.event}`);

        if (payload.event === 'payment.captured') {
            const payment = payload.payload?.payment?.entity;
            if (!payment) {
                console.error("[Webhook] payment.captured event missing payment entity", payload);
                return res.status(400).json({ error: "Malformed payload" });
            }

            const notes = payment.notes || {};
            const admin = getSupabaseAdmin();

            if (!admin) {
                // Don't fail the webhook (Razorpay would just retry forever) — log loudly instead
                // so this is easy to catch during setup.
                console.error("[Webhook] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — payment verified but NOT recorded:", payment.id);
                return res.status(200).json({ received: true, recorded: false, reason: "Supabase admin client not configured" });
            }

            const donationRecord: Record<string, any> = {
                donor_name: notes.donor_name || null,
                donor_email: notes.donor_email || payment.email || null,
                amount: payment.amount / 100, // paise -> rupees
                fund_id: notes.fund_id || null,
                status: 'success',
                payment_id: payment.id,
                frequency: notes.frequency || 'once',
                pan_number: notes.pan_number || null,
                is_verified: true, // Trusted: this row only exists because Razorpay itself confirmed the capture
            };
            if (notes.volunteer_id) {
                const parsed = parseInt(notes.volunteer_id, 10);
                if (!Number.isNaN(parsed)) donationRecord.volunteer_id = parsed;
            }

            // Checked BEFORE the upsert below so we know whether this is the
            // first time we're seeing this payment_id — the receipt email
            // should only go out once, but Razorpay retries this webhook on
            // any non-2xx/timeout, and upsert alone can't tell us "was this
            // an insert or just a repeat update" after the fact.
            const { data: existingDonation } = await admin
                .from('donations')
                .select('payment_id')
                .eq('payment_id', payment.id)
                .maybeSingle();
            const isFirstTimeRecording = !existingDonation;

            // Upsert keyed on payment_id so Razorpay's automatic webhook retries
            // (it retries on any non-2xx or timeout) never create duplicate rows.
            // Requires a unique constraint on donations.payment_id — see
            // add_donations_payment_id_unique.sql.
            const { error } = await admin
                .from('donations')
                .upsert(donationRecord, { onConflict: 'payment_id' });

            if (error) {
                console.error("[Webhook] Failed to upsert donation:", error);
                // Return 500 so Razorpay retries — we want this to eventually land.
                return res.status(500).json({ error: "Database write failed" });
            }

            console.log(`[Webhook] Recorded verified donation for payment ${payment.id}`);

            if (isFirstTimeRecording) {
                await sendDonationReceipt({
                    donor_name: donationRecord.donor_name,
                    donor_email: donationRecord.donor_email,
                    amount: donationRecord.amount,
                    fund_id: donationRecord.fund_id,
                    payment_id: donationRecord.payment_id,
                    frequency: donationRecord.frequency,
                    pan_number: donationRecord.pan_number,
                });
            }
        } else if (payload.event === 'payment.failed') {
            const payment = payload.payload?.payment?.entity;
            console.warn(`[Webhook] Payment failed: ${payment?.id}`, payment?.error_description);
        } else {
            console.log(`[Webhook] Unhandled event type: ${payload.event}`);
        }

        // Always ack quickly once handled — Razorpay expects a fast 2xx.
        res.status(200).json({ received: true });
    } catch (error: any) {
        console.error("[Webhook] Unexpected error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
  });

  app.use(express.json());

  // Create Order Endpoint
  app.post('/api/create-order', async (req, res) => {
    console.log("\n[API: /create-order] Received request:", req.body);
    try {
      const { amount, currency = "INR", receipt } = req.body;

      // `amount` arrives from the frontend in rupees (e.g. 5000 = ₹5000).
      // Razorpay's API requires the amount in the smallest currency unit (paise).
      const amountInPaise = Math.round(Number(amount) * 100);

      if (!amount || !Number.isFinite(amountInPaise) || amountInPaise < 100) {
          console.error("[API: /create-order] Validation failed: amount missing or below ₹1");
          return res.status(400).json({ error: "Minimum amount is ₹1" });
      }

      const rzp = getRazorpay();
      const options = {
        amount: amountInPaise,
        currency,
        receipt,
      };
      console.log("[API: /create-order] Calling Razorpay rzp.orders.create with options:", options);

      const order = await rzp.orders.create(options);
      console.log("[API: /create-order] Razorpay order created successfully:", order);
      res.json({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency
      });
    } catch (error: any) {
      console.error("[API: /create-order] Error creating order via Razorpay:", error);
      res.status(500).json({ error: error.message || "Failed to create order" });
    }
  });


  // Create Subscription Endpoint
  //
  // Razorpay Subscriptions are bound to a fixed-amount "Plan" — a Plan can't hold a
  // variable/custom amount, and a single static plan_id (the old approach) means
  // every donor gets charged whatever that one Plan says, ignoring whatever amount
  // they actually picked (₹1000 / ₹2500 / ₹5000 / custom). To support the donor's
  // chosen amount correctly, we create a fresh Plan matching their exact amount at
  // subscribe-time, then subscribe them to it. Razorpay Plans are lightweight — this
  // just means the Dashboard accumulates one Plan per distinct amount subscribed to,
  // which is harmless.
  app.post('/api/create-subscription', async (req, res) => {
    console.log("\n[API: /create-subscription] Received request:", req.body);
    try {
      const { amount, total_count = 120, notes } = req.body;

      const amountInPaise = Math.round(Number(amount) * 100);
      if (!amount || !Number.isFinite(amountInPaise) || amountInPaise < 100) {
          console.error("[API: /create-subscription] Validation failed: amount missing or below ₹1");
          return res.status(400).json({ error: "Minimum amount is ₹1" });
      }

      const rzp = getRazorpay();

      const plan = await rzp.plans.create({
        period: 'monthly',
        interval: 1,
        item: {
            name: `Monthly Donation - ₹${amount}`,
            amount: amountInPaise,
            currency: 'INR',
        },
        notes: notes || {},
      });
      console.log("[API: /create-subscription] Created Plan:", plan.id, "for amount (paise):", amountInPaise);

      const options = {
        plan_id: plan.id,
        customer_notify: 1 as const,
        total_count,
        // Attached to the subscription itself (not just the first payment), so every
        // auto-charged recurring payment inherits these notes too. Recurring charges
        // happen entirely on Razorpay's servers with no browser involved — the webhook
        // is the only thing that ever records them, so it needs this data to be here.
        notes: notes || {},
      };
      console.log("[API: /create-subscription] Calling Razorpay rzp.subscriptions.create with options:", options);

      const subscription = await rzp.subscriptions.create(options);
      console.log("[API: /create-subscription] Razorpay subscription created successfully:", subscription);
      res.json({
        subscription_id: subscription.id,
      });
    } catch (error: any) {
      console.error("[API: /create-subscription] Error creating subscription via Razorpay:", error);
      res.status(500).json({ error: error.message || "Failed to create subscription" });
    }
  });

  // Verify Payment Endpoint
  app.post('/api/verify-payment', (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        
        const key_secret = process.env.RAZORPAY_KEY_SECRET;
        if (!key_secret) {
             throw new Error("RAZORPAY_KEY_SECRET not set in environment");
        }

        const generated_signature = crypto
            .createHmac('sha256', key_secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generated_signature === razorpay_signature) {
            res.json({ success: true, message: "Payment verified successfully" });
        } else {
            res.status(400).json({ success: false, error: "Signature mismatch" });
        }
    } catch (error: any) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.error("Error starting vite", err);
    }
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Support React Router fallback
    app.use((req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
