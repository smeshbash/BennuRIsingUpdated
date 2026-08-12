import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

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
  app.post('/api/create-subscription', async (req, res) => {
    console.log("\n[API: /create-subscription] Received request:", req.body);
    try {
      const { plan_id, total_count = 120, notes } = req.body;

      if (!plan_id) {
          console.error("[API: /create-subscription] Validation failed: plan_id is missing");
          return res.status(400).json({ error: "plan_id is required" });
      }

      const rzp = getRazorpay();
      const options = {
        plan_id,
        customer_notify: 1,
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
