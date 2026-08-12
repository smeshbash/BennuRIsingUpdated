-- Required for the Razorpay webhook's upsert(onConflict: 'payment_id') to work
-- and to be idempotent against Razorpay's automatic webhook retries (Razorpay
-- retries delivery on any non-2xx response or timeout, which would otherwise
-- create duplicate donation rows for the same payment).
--
-- Run this once against your Supabase project (SQL Editor, or via CLI/migration).

-- If any existing rows already have a NULL payment_id, a plain UNIQUE constraint
-- is still fine — Postgres allows multiple NULLs in a UNIQUE column.
ALTER TABLE public.donations
  ADD CONSTRAINT donations_payment_id_key UNIQUE (payment_id);
