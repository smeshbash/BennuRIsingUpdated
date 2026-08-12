-- Locks the `donations` table down so only the trusted server-side webhook
-- (using the Supabase service role key, which bypasses RLS entirely) can ever
-- write a row. The frontend no longer writes to this table at all — see
-- DonateFlow.tsx's recordDonation(), which now only updates local UI state.
--
-- Why this matters: `fix_donations_insert.sql` in this repo creates
-- `CREATE POLICY "Public insert donations" ON public.donations FOR INSERT WITH CHECK (true);`
-- which lets ANYONE with the public anon key insert an arbitrary row directly
-- via the Supabase REST API — including is_verified: true and any amount —
-- with no payment ever having happened. That's independent of what the React
-- app's code does; it's a database-level hole. This migration closes it.
--
-- Run this once against your Supabase project (SQL Editor, or via CLI/migration),
-- AFTER the webhook (RAZORPAY_WEBHOOK_SECRET + SUPABASE_SERVICE_ROLE_KEY) is
-- configured and tested — once this runs, donations can ONLY be recorded via
-- the webhook. Do not re-run fix_donations_insert.sql after this.

DROP POLICY IF EXISTS "Public insert donations" ON public.donations;

-- No replacement INSERT policy for anon/authenticated is created intentionally.
-- The service-role client used by /api/webhooks/razorpay bypasses RLS by design,
-- so it does not need (and should not have) an explicit policy here.

-- Belt-and-braces: also make sure there's no public UPDATE policy, so an
-- already-inserted row can't be tampered with after the fact either.
DROP POLICY IF EXISTS "Public update donations" ON public.donations;
DROP POLICY IF EXISTS "Public update donations volunteer_id" ON public.donations;
