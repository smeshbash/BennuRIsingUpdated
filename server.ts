import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import PDFDocument from 'pdfkit';

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

  // Logo lives at dist/logo1.png in production (Vite copies public/ into the
  // build output root) but only at public/logo1.png in local dev (no dist/
  // until you actually run a build). Tries both, falls back to no logo
  // rather than failing the whole receipt if neither is found.
  const getLogoPath = (): string | null => {
    const distLogo = path.join(process.cwd(), 'dist', 'logo1.png');
    const publicLogo = path.join(process.cwd(), 'public', 'logo1.png');
    if (fs.existsSync(distLogo)) return distLogo;
    if (fs.existsSync(publicLogo)) return publicLogo;
    return null;
  }

  // Brand palette — mirrors the Tailwind config in index.html.
  const BRAND = {
    blue: '#003F7F',
    red: '#D9381E',
    green: '#4CAF50',
    dark: '#1F2937',
    gray: '#6b7280',
    lightGray: '#9ca3af',
    border: '#E5E7EB',
    panel: '#F4F6F9',
  };

  // Renders a one-page PDF payment receipt as a Buffer. Plain payment
  // confirmation only — no 80G/tax-exemption claims, since that requires
  // registration details (80G number, trust PAN, Form 10BD/10BE filing
  // status) this app doesn't have and shouldn't assert on its own.
  const generateReceiptPdf = (donation: {
    donor_name: string | null;
    amount: number;
    fundName: string;
    payment_id: string;
    frequencyLabel: string;
    dateStr: string;
  }): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: 'A4', margin: 0 });
        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        const pageW = doc.page.width; // 595.28
        const left = 50;
        const right = pageW - 50;
        const contentW = right - left;

        // Outer frame — gives the page a "certificate" edge rather than
        // content just floating on blank white.
        doc.rect(20, 20, pageW - 40, doc.page.height - 40).lineWidth(1).strokeColor(BRAND.border).stroke();

        // --- Header: logo left, receipt meta right ---
        const logoPath = getLogoPath();
        if (logoPath) {
          doc.image(logoPath, left, 42, { height: 54 });
        } else {
          doc.fontSize(16).font('Helvetica-Bold').fillColor(BRAND.blue).text('Bennu Rising International Foundation', left, 55);
        }
        doc.fontSize(9).font('Helvetica-Bold').fillColor(BRAND.lightGray)
          .text('PAYMENT RECEIPT', left, 46, { width: contentW, align: 'right', characterSpacing: 1 });
        doc.fontSize(9).font('Helvetica').fillColor(BRAND.lightGray)
          .text(donation.payment_id, left, 60, { width: contentW, align: 'right' });
        doc.fontSize(9).font('Helvetica').fillColor(BRAND.lightGray)
          .text(donation.dateStr, left, 74, { width: contentW, align: 'right' });

        // Two-tone accent rule under the header
        doc.rect(left, 112, contentW, 3).fill(BRAND.blue);
        doc.rect(left, 115, contentW, 1.5).fill(BRAND.green);

        // --- Hero: thank-you + big amount + paid badge ---
        doc.fontSize(20).font('Helvetica-Bold').fillColor(BRAND.dark)
          .text('Thank you for your generosity!', left, 150, { width: contentW, align: 'center' });
        doc.fontSize(10).font('Helvetica').fillColor(BRAND.gray)
          .text('Your contribution helps bring healing and hope to those who need it most.', left, 176, { width: contentW, align: 'center' });

        doc.fontSize(38).font('Helvetica-Bold').fillColor(BRAND.blue)
          .text(`Rs. ${donation.amount}`, left, 205, { width: contentW, align: 'center' });

        // Note: no ✓ Unicode glyph here — PDFKit's built-in Helvetica font
        // doesn't include it and renders garbage instead. Drawing an actual
        // checkmark as vector strokes instead, so it always renders cleanly.
        const badgeW = 92, badgeH = 24;
        const badgeX = left + (contentW - badgeW) / 2;
        const badgeY = 258;
        doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 12).fill(BRAND.green);

        const checkCx = badgeX + 22;
        const checkCy = badgeY + badgeH / 2;
        doc.save();
        doc.moveTo(checkCx - 5, checkCy)
          .lineTo(checkCx - 1.5, checkCy + 4)
          .lineTo(checkCx + 6, checkCy - 5)
          .lineWidth(1.8)
          .strokeColor('#ffffff')
          .lineJoin('round')
          .lineCap('round')
          .stroke();
        doc.restore();

        doc.fontSize(10).font('Helvetica-Bold').fillColor('#ffffff')
          .text('PAID', badgeX + 34, badgeY + 7, { width: badgeW - 44, align: 'left' });

        // --- Details panel ---
        const panelY = 310;
        const panelH = 190;
        doc.roundedRect(left, panelY, contentW, panelH, 8).fill(BRAND.panel);
        doc.roundedRect(left, panelY, contentW, panelH, 8).lineWidth(1).strokeColor(BRAND.border).stroke();

        doc.fontSize(9).font('Helvetica-Bold').fillColor(BRAND.lightGray)
          .text('DONATION DETAILS', left + 24, panelY + 20, { characterSpacing: 1 });
        doc.moveTo(left + 24, panelY + 36).lineTo(right - 24, panelY + 36).lineWidth(0.5).strokeColor(BRAND.border).stroke();

        const rows: [string, string][] = [
          ['Receipt For', donation.donor_name || 'Donor'],
          ['Amount', `Rs. ${donation.amount}`],
          ['Type', donation.frequencyLabel],
          ['Allocated To', donation.fundName],
          ['Date', donation.dateStr],
          ['Payment Reference', donation.payment_id],
        ];
        let rowY = panelY + 48;
        for (const [label, value] of rows) {
          doc.fontSize(10.5).font('Helvetica').fillColor(BRAND.gray).text(label, left + 24, rowY);
          doc.fontSize(10.5).font('Helvetica-Bold').fillColor(BRAND.dark)
            .text(value, left + 24, rowY, { width: contentW - 48, align: 'right' });
          rowY += 23;
        }

        // --- Footer ---
        const footerY = panelY + panelH + 30;
        doc.moveTo(left, footerY).lineTo(right, footerY).lineWidth(0.5).strokeColor(BRAND.border).stroke();
        doc.fontSize(10).font('Helvetica-Bold').fillColor(BRAND.dark)
          .text('Bennu Rising International Foundation', left, footerY + 14, { width: contentW, align: 'center' });
        doc.fontSize(8.5).font('Helvetica').fillColor(BRAND.gray)
          .text('10/62, Odakkal Sreepatham, Eruva East PO, Kayamkulam, Muthukulam, Karthikappally, Alappuzha, Kerala, India - 690506', left, footerY + 30, { width: contentW, align: 'center' });
        doc.fontSize(8.5).font('Helvetica').fillColor(BRAND.blue)
          .text('bennurisinginternational.org', left, footerY + 44, { width: contentW, align: 'center' });

        const ackText = "Thank you for your generous contribution. We gratefully acknowledge that this is a voluntary donation made to support the organization's charitable activities. No goods or services were provided, in whole or in part, by Bennu Rising International Foundation to the donor in exchange for this contribution.";
        const ackWidth = contentW - 40;
        doc.fontSize(8).font('Helvetica-Oblique').fillColor(BRAND.lightGray)
          .text(ackText, left + 20, footerY + 66, { width: ackWidth, align: 'center' });
        const ackHeight = doc.heightOfString(ackText, { width: ackWidth });

        doc.fontSize(8).font('Helvetica-Oblique').fillColor(BRAND.lightGray)
          .text(
            'This is a computer-generated payment receipt confirming a donation received via Razorpay. It does not constitute a tax-exemption certificate.',
            left + 20, footerY + 66 + ackHeight + 8, { width: ackWidth, align: 'center' }
          );

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
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
      const siteUrl = process.env.SITE_URL || 'https://bennurisinginternational.org';
      const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
      const frequencyLabel = donation.frequency === 'monthly' ? 'Monthly Donation (First Installment)' : 'One-Time Donation';

      const pdfBuffer = await generateReceiptPdf({
          donor_name: donation.donor_name,
          amount: donation.amount,
          fundName,
          payment_id: donation.payment_id,
          frequencyLabel,
          dateStr,
      });

      await resendClient.emails.send({
          from: `Bennu Rising International Foundation <${fromAddress}>`,
          to: donation.donor_email,
          subject: `Your donation receipt — ₹${donation.amount}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#1f2937;">
              <div style="text-align:center;margin-bottom:24px;">
                <img src="${siteUrl}/logo1.png" alt="Bennu Rising International Foundation" height="48" style="height:48px;width:auto;" />
                <p style="color:#9ca3af;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin:8px 0 0;">Heal. Empower. Rise.</p>
              </div>
              <h2 style="color:#003F7F;">Thank you, ${donation.donor_name || 'friend'}!</h2>
              <p>Your generosity brings healing and hope. Here's your donation receipt — a PDF copy is attached too.</p>
              <table style="width:100%;border-collapse:collapse;margin:20px 0;">
                <tr><td style="padding:8px 0;color:#6b7280;">Amount</td><td style="padding:8px 0;text-align:right;font-weight:bold;">₹${donation.amount}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280;">Type</td><td style="padding:8px 0;text-align:right;">${frequencyLabel}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280;">Allocated to</td><td style="padding:8px 0;text-align:right;">${fundName}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280;">Date</td><td style="padding:8px 0;text-align:right;">${dateStr}</td></tr>
                <tr><td style="padding:8px 0;color:#6b7280;">Reference ID</td><td style="padding:8px 0;text-align:right;font-family:monospace;font-size:12px;">${donation.payment_id}</td></tr>
              </table>
              <p style="color:#6b7280;font-size:12px;line-height:1.5;border-top:1px solid #e5e7eb;padding-top:16px;">Thank you for your generous contribution. We gratefully acknowledge that this is a voluntary donation made to support the organization's charitable activities. No goods or services were provided, in whole or in part, by Bennu Rising International Foundation to the donor in exchange for this contribution.</p>
              <p style="color:#6b7280;font-size:13px;margin-top:24px;">Bennu Rising International Foundation<br/>10/62, Odakkal Sreepatham, Eruva East PO, Kayamkulam, Muthukulam, Karthikappally, Alappuzha, Kerala, India - 690506</p>
            </div>
          `,
          attachments: [
              {
                  filename: `receipt-${donation.payment_id}.pdf`,
                  content: pdfBuffer,
              },
          ],
      });
      console.log(`[Receipt] Sent donation receipt (with PDF) to ${donation.donor_email} for payment ${donation.payment_id}`);
    } catch (err: any) {
      console.error("[Receipt] Failed to send donation receipt email:", err);
    }
  }

  // Sends a new volunteer their welcome/onboarding email once their signup
  // application is recorded (payment verified). Supabase's own auth emails
  // (OTP codes for the volunteer portal login) are purely transactional and
  // don't actually welcome anyone — this is the "you're in, here's what's
  // next" email that was missing. Same best-effort contract as the donation
  // receipt: never throws, never blocks or fails the webhook.
  const sendVolunteerWelcomeEmail = async (volunteer: {
    first_name: string | null;
    email: string | null;
    application_id: number | string | null;
  }) => {
    try {
      const resendClient = getResend();
      if (!resendClient) {
          console.log("[Welcome] RESEND_API_KEY not set — skipping volunteer welcome email");
          return;
      }
      if (!volunteer.email) {
          console.log("[Welcome] No volunteer email on this application — skipping welcome email");
          return;
      }

      const fromAddress = process.env.RECEIPT_FROM_EMAIL || 'onboarding@resend.dev';
      const siteUrl = process.env.SITE_URL || 'https://bennurisinginternational.org';
      const firstName = volunteer.first_name || 'friend';
      const donationLink = volunteer.application_id
          ? `${siteUrl}/donate?vid=${volunteer.application_id}`
          : `${siteUrl}/donate`;

      await resendClient.emails.send({
          from: `Bennu Rising International Foundation <${fromAddress}>`,
          to: volunteer.email,
          subject: `Welcome to Bennu Rising, ${firstName}!`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#1f2937;">
              <div style="text-align:center;margin-bottom:24px;">
                <img src="${siteUrl}/logo1.png" alt="Bennu Rising International Foundation" height="48" style="height:48px;width:auto;" />
                <p style="color:#9ca3af;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin:8px 0 0;">Heal. Empower. Rise.</p>
              </div>
              <h2 style="color:#003F7F;">Welcome to the family, ${firstName}!</h2>
              <p>You just became part of something bigger than yourself. Every year, people sign up meaning to help "someday" — you didn't wait. That decision is already the first step in bringing healing, education, and hope to communities that need it most, and we're genuinely glad to have you with us.</p>
              <p>This isn't just a volunteer role. It's a seat at the table with a team that shows up for people on their hardest days — and you're going to be part of the reason someone's story turns around.</p>

              <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin:24px 0;">
                <h3 style="color:#003F7F;margin-top:0;font-size:15px;">What happens next</h3>
                <p style="margin:8px 0;"><strong>A personal call.</strong> A representative from our team will call you soon to walk you through your role and answer any questions.</p>
                <p style="margin:8px 0;"><strong>Weekly orientation.</strong> We run a weekly Zoom session for new volunteers, walking you through everything you need to get started. We'll share the exact day, time, and link with advance notice — keep an eye on your inbox.</p>
              </div>

              <div style="background:#eef2ff;border-radius:12px;padding:20px;margin:24px 0;text-align:center;">
                <p style="margin:0 0 12px 0;font-weight:bold;color:#1f2937;">Your personal fundraising link</p>
                <p style="margin:0 0 16px 0;font-size:13px;color:#6b7280;">Every donation made through this link is tracked back to you — share it with friends and family to multiply your impact from day one.</p>
                <a href="${donationLink}" style="display:inline-block;background:#003F7F;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 24px;border-radius:8px;font-size:14px;">${donationLink}</a>
              </div>

              <p>Thank you for saying yes. We can't wait to see what we build together.</p>
              <p style="margin-top:24px;">With gratitude,<br/>The Bennu Rising International Foundation Team</p>
              <p style="color:#6b7280;font-size:13px;margin-top:24px;border-top:1px solid #e5e7eb;padding-top:16px;">Bennu Rising International Foundation<br/>10/62, Odakkal Sreepatham, Eruva East PO, Kayamkulam, Muthukulam, Karthikappally, Alappuzha, Kerala, India - 690506</p>
            </div>
          `,
      });
      console.log(`[Welcome] Sent volunteer welcome email to ${volunteer.email}`);
    } catch (err: any) {
      console.error("[Welcome] Failed to send volunteer welcome email:", err);
    }
  }

  // Sends the contributor portal login instructions — a separate email from
  // the initial signup welcome email, sent only once an admin actually
  // accepts the application (not at signup time, when acceptance is still
  // pending review). Triggered from POST /api/admin/send-portal-invite below.
  const sendPortalInviteEmail = async (applicant: {
    first_name: string | null;
    email: string | null;
    application_type: string | null;
  }) => {
    try {
      const resendClient = getResend();
      if (!resendClient) {
          console.log("[PortalInvite] RESEND_API_KEY not set — skipping portal invite email");
          return;
      }
      if (!applicant.email) {
          console.log("[PortalInvite] No email on this application — skipping portal invite email");
          return;
      }

      const fromAddress = process.env.RECEIPT_FROM_EMAIL || 'onboarding@resend.dev';
      const siteUrl = process.env.SITE_URL || 'https://bennurisinginternational.org';
      const firstName = applicant.first_name || 'friend';
      const portalPath = applicant.application_type === 'internship' ? '/internship-portal' : '/volunteer-portal';
      const portalLink = `${siteUrl}${portalPath}`;

      await resendClient.emails.send({
          from: `Bennu Rising International Foundation <${fromAddress}>`,
          to: applicant.email,
          subject: `You're in, ${firstName}! Here's how to access your portal`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#1f2937;">
              <div style="text-align:center;margin-bottom:24px;">
                <img src="${siteUrl}/logo1.png" alt="Bennu Rising International Foundation" height="48" style="height:48px;width:auto;" />
                <p style="color:#9ca3af;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin:8px 0 0;">Heal. Empower. Rise.</p>
              </div>
              <h2 style="color:#003F7F;">Your application has been accepted, ${firstName}!</h2>
              <p>Great news — your application is officially approved. You now have access to your personal contributor portal, where you can track your progress, manage your goals, view and download your certificates, and see the impact of the donations raised through your personal link.</p>

              <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin:24px 0;">
                <h3 style="color:#003F7F;margin-top:0;font-size:15px;">How to log in</h3>
                <p style="margin:8px 0;font-size:13px;line-height:1.6;">There's no password to remember. Just go to the portal link below, enter this email address, and we'll send you a one-time 6-digit code to sign in.</p>
                <ol style="margin:8px 0;padding-left:20px;font-size:13px;line-height:1.8;">
                  <li>Open the portal link below</li>
                  <li>Enter <strong>${applicant.email}</strong></li>
                  <li>Check your inbox for a 6-digit code and enter it</li>
                </ol>
              </div>

              <div style="text-align:center;margin:24px 0;">
                <a href="${portalLink}" style="display:inline-block;background:#003F7F;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 24px;border-radius:8px;font-size:14px;">Go to your portal</a>
              </div>

              <p>We're excited to have you fully on board. If you have any trouble logging in, just reply to this email.</p>
              <p style="margin-top:24px;">With gratitude,<br/>The Bennu Rising International Foundation Team</p>
              <p style="color:#6b7280;font-size:13px;margin-top:24px;border-top:1px solid #e5e7eb;padding-top:16px;">Bennu Rising International Foundation<br/>10/62, Odakkal Sreepatham, Eruva East PO, Kayamkulam, Muthukulam, Karthikappally, Alappuzha, Kerala, India - 690506</p>
            </div>
          `,
      });
      console.log(`[PortalInvite] Sent portal invite email to ${applicant.email}`);
    } catch (err: any) {
      console.error("[PortalInvite] Failed to send portal invite email:", err);
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

            // Volunteer/internship signup registration fee — a different shape of
            // payment than a regular donation, so it's branched out here rather
            // than falling into the donationRecord logic below.
            //
            // Previously, VolunteerSignupPage/InternshipSignupPage opened Razorpay
            // Checkout directly in the browser (no server-created order) and, on
            // the client-side success callback, wrote straight to Supabase —
            // including a donations row with is_verified: true — using whatever
            // payment_id the browser reported. That's client-side JS, fully
            // editable via devtools, with no server verification at all: anyone
            // could fabricate a "paid, verified" application without paying
            // anything. Recording it here instead, driven only by a real
            // HMAC-verified webhook delivery from Razorpay and the payment.notes
            // Razorpay itself returns (not anything the browser claims after the
            // fact), closes that off.
            if (notes.signup_type === 'volunteer' || notes.signup_type === 'internship') {
                const { data: existingApp } = await admin
                    .from('volunteer_applications')
                    .select('id')
                    .eq('payment_id', payment.id)
                    .maybeSingle();

                if (existingApp) {
                    console.log(`[Webhook] Signup application for payment ${payment.id} already recorded — skipping (Razorpay retry)`);
                    return res.status(200).json({ received: true, recorded: true, duplicate: true });
                }

                const applicationRecord = {
                    first_name: notes.first_name || null,
                    last_name: notes.last_name || null,
                    email: notes.email || payment.email || null,
                    phone: notes.phone || payment.contact || null,
                    interest: notes.interest || null,
                    amount_paid: payment.amount / 100,
                    payment_id: payment.id,
                    application_type: notes.signup_type,
                    // Timestamped record that the applicant accepted the
                    // Terms & Conditions (including the certificate/
                    // recognition eligibility clauses) at signup — sourced
                    // from Razorpay's own payment.notes, not re-derived or
                    // trusted from any later client request.
                    terms_accepted_at: notes.terms_accepted === 'true' ? (notes.terms_accepted_at || null) : null,
                    terms_version: notes.terms_accepted === 'true' ? (notes.terms_version || null) : null,
                };

                // .select('id').single() so we get the new row's id back —
                // needed to build the personalized donation link
                // (?vid=<application id>) in the volunteer welcome email below.
                const { data: insertedApp, error: appError } = await admin
                    .from('volunteer_applications')
                    .insert(applicationRecord)
                    .select('id')
                    .single();
                if (appError) {
                    console.error("[Webhook] Failed to insert volunteer/internship application:", appError);
                    return res.status(500).json({ error: "Database write failed" });
                }
                console.log(`[Webhook] Recorded ${notes.signup_type} application for payment ${payment.id}`);

                // Volunteer signups (not internship) also record the fee as a
                // donation — matching the pre-fix behavior, which wrote both a
                // donations row and a volunteer_applications row for this flow.
                if (notes.signup_type === 'volunteer') {
                    const { error: donationError } = await admin.from('donations').upsert({
                        donor_name: `${notes.first_name || ''} ${notes.last_name || ''}`.trim() || null,
                        donor_email: applicationRecord.email,
                        amount: applicationRecord.amount_paid,
                        fund_id: 'general',
                        status: 'success',
                        payment_id: payment.id,
                        frequency: 'once',
                        is_verified: true,
                    }, { onConflict: 'payment_id' });
                    if (donationError) {
                        console.error("[Webhook] Failed to record signup fee as a donation:", donationError);
                        // Don't fail the whole webhook over this — the application
                        // itself is already safely recorded above, which is the
                        // part that actually matters for the applicant.
                    }

                    // Onboarding welcome email — best-effort, mirrors the
                    // donation receipt's error-swallowing contract so a flaky
                    // email provider never fails this webhook or blocks the
                    // applicant's checkout flow.
                    await sendVolunteerWelcomeEmail({
                        first_name: applicationRecord.first_name,
                        email: applicationRecord.email,
                        application_id: insertedApp?.id ?? null,
                    });
                }

                return res.status(200).json({ received: true, recorded: true });
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

  // Send Portal Invite Endpoint
  //
  // Fires the "you're accepted, here's how to log in" email — separate from
  // the signup welcome email, and only meant to go out once an admin has
  // actually approved the application. The admin dashboard's status update
  // (VolunteersManager in AdminPages.tsx) still writes status='approved'
  // directly via the RLS-protected Supabase client exactly as before; this
  // endpoint only handles sending the email, and re-derives everything from
  // the database rather than trusting whatever the client claims about the
  // applicant.
  //
  // Auth: the caller's own Supabase access token is forwarded in the
  // Authorization header. We open a request-scoped Supabase client with that
  // token (not the service-role key) and call the same is_admin() function
  // the database's own RLS policies use, so "is this caller actually an
  // admin" is answered by the database under the caller's real identity —
  // not by trusting a role claim the frontend sends.
  app.post('/api/admin/send-portal-invite', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
          return res.status(401).json({ error: "Missing bearer token" });
      }
      const token = authHeader.slice(7);

      const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
      const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !anonKey) {
          console.error("[PortalInvite] Supabase URL/anon key not configured");
          return res.status(500).json({ error: "Server not configured" });
      }

      const callerClient = createClient(supabaseUrl, anonKey, {
          auth: { autoRefreshToken: false, persistSession: false },
          global: { headers: { Authorization: `Bearer ${token}` } },
      });
      const { data: isAdmin, error: adminCheckError } = await callerClient.rpc('is_admin');
      if (adminCheckError || !isAdmin) {
          console.warn("[PortalInvite] Rejected non-admin or invalid-token request:", adminCheckError?.message);
          return res.status(403).json({ error: "Admins only" });
      }

      const { application_id } = req.body;
      if (!application_id) {
          return res.status(400).json({ error: "application_id is required" });
      }

      const admin = getSupabaseAdmin();
      if (!admin) {
          return res.status(500).json({ error: "Server not configured" });
      }

      // Re-fetch from the database rather than trusting anything the client
      // sent about the applicant — and confirm the application is actually
      // approved before sending an "you're accepted" email.
      const { data: application, error: fetchError } = await admin
          .from('volunteer_applications')
          .select('id, first_name, email, application_type, status')
          .eq('id', application_id)
          .maybeSingle();

      if (fetchError || !application) {
          return res.status(404).json({ error: "Application not found" });
      }
      if (application.status !== 'approved') {
          return res.status(409).json({ error: "Application is not in approved status" });
      }

      await sendPortalInviteEmail({
          first_name: application.first_name,
          email: application.email,
          application_type: application.application_type,
      });

      res.json({ sent: true });
    } catch (error: any) {
      console.error("[PortalInvite] Unexpected error:", error);
      res.status(500).json({ error: "Internal server error" });
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
