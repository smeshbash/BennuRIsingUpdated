-- Run this in Supabase SQL editor to enable custom certificate categories
ALTER TABLE public.portal_certificates DROP CONSTRAINT IF EXISTS portal_certificates_certificate_type_check;

-- Optionally, add custom fields to portal_certificates for dynamic attributes
ALTER TABLE public.portal_certificates ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;
