-- Security Fix Script for Bennu Rising Foundation
-- Run this in your Supabase SQL Editor to secure your database.

-- 1. Secure admin_whitelist
DROP POLICY IF EXISTS "Public read whitelist" ON public.admin_whitelist;
CREATE POLICY "Public read whitelist" ON public.admin_whitelist FOR SELECT USING (public.is_admin());

-- 2. Secure donations
-- Ensure volunteer_id column exists
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS volunteer_id integer;

DROP POLICY IF EXISTS "Public read donations" ON public.donations;
CREATE POLICY "Public read donations" ON public.donations FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Public update donations volunteer_id" ON public.donations;
-- No public update allowed on donations

-- 3. Secure volunteer_applications
DROP POLICY IF EXISTS "Public read volunteers" ON public.volunteer_applications;
-- Read is already restricted to owner or admin by "Users can read own application" and "Admin manage volunteers"

DROP POLICY IF EXISTS "Public update volunteers" ON public.volunteer_applications;
-- Update is already restricted to owner or admin by "Users can update own application" and "Admin manage volunteers"

-- 4. Secure system_settings (Optional: if you want to hide Razorpay keys from public)
-- Note: Razorpay Key ID is needed by frontend, but Secret must NEVER be here.
-- If you have sensitive settings, consider restricting this table.
