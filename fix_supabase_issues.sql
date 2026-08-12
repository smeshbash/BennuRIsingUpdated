-- 1. Fix the new user trigger to default to 'volunteer' instead of 'content_manager'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(
      (SELECT role FROM public.admin_whitelist WHERE lower(email) = lower(new.email)),
      'volunteer' -- Use 'volunteer' as the safe default instead of 'content_manager'
    )
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Alter the profiles & whitelist tables so new entries default to 'volunteer' at the DB schema level
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'volunteer'::text;
ALTER TABLE public.admin_whitelist ALTER COLUMN role SET DEFAULT 'volunteer'::text;

-- 3. Downgrade any profiles that were mistakenly granted 'content_manager' back to 'volunteer'
-- (Only affects those not in the admin_whitelist)
UPDATE public.profiles
SET role = 'volunteer'
WHERE role = 'content_manager'
  AND lower(email) NOT IN (SELECT lower(email) FROM public.admin_whitelist);

-- 4. Create the missing RPC function needed for the Contributor Portal login verification
CREATE OR REPLACE FUNCTION public.check_application_status(p_email text, p_type text DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.volunteer_applications
    WHERE lower(email) = lower(p_email)
      AND status = 'approved'
      AND (p_type IS NULL OR application_type = p_type)
  );
END;
$$;

-- 5. Fix the Revoke (Delete) Policies for Admin so they can delete certificates and tasks
ALTER TABLE public.portal_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins select tasks" ON public.portal_tasks;
DROP POLICY IF EXISTS "Admins insert tasks" ON public.portal_tasks;
DROP POLICY IF EXISTS "Admins update tasks" ON public.portal_tasks;
DROP POLICY IF EXISTS "Admins delete tasks" ON public.portal_tasks;
DROP POLICY IF EXISTS "Admins select goals" ON public.portal_goals;
DROP POLICY IF EXISTS "Admins insert goals" ON public.portal_goals;
DROP POLICY IF EXISTS "Admins update goals" ON public.portal_goals;
DROP POLICY IF EXISTS "Admins delete goals" ON public.portal_goals;
DROP POLICY IF EXISTS "Admins select certs" ON public.portal_certificates;
DROP POLICY IF EXISTS "Admins insert certs" ON public.portal_certificates;
DROP POLICY IF EXISTS "Admins update certs" ON public.portal_certificates;
DROP POLICY IF EXISTS "Admins delete certs" ON public.portal_certificates;

CREATE POLICY "Admins select tasks" ON public.portal_tasks FOR SELECT USING (public.is_admin() OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'volunteer_manager'));
CREATE POLICY "Admins insert tasks" ON public.portal_tasks FOR INSERT WITH CHECK (public.is_admin() OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'volunteer_manager'));
CREATE POLICY "Admins update tasks" ON public.portal_tasks FOR UPDATE USING (public.is_admin() OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'volunteer_manager'));
CREATE POLICY "Admins delete tasks" ON public.portal_tasks FOR DELETE USING (public.is_admin() OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'volunteer_manager'));

CREATE POLICY "Admins select goals" ON public.portal_goals FOR SELECT USING (public.is_admin() OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'volunteer_manager'));
CREATE POLICY "Admins insert goals" ON public.portal_goals FOR INSERT WITH CHECK (public.is_admin() OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'volunteer_manager'));
CREATE POLICY "Admins update goals" ON public.portal_goals FOR UPDATE USING (public.is_admin() OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'volunteer_manager'));
CREATE POLICY "Admins delete goals" ON public.portal_goals FOR DELETE USING (public.is_admin() OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'volunteer_manager'));

CREATE POLICY "Admins select certs" ON public.portal_certificates FOR SELECT USING (public.is_admin() OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'volunteer_manager'));
CREATE POLICY "Admins insert certs" ON public.portal_certificates FOR INSERT WITH CHECK (public.is_admin() OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'volunteer_manager'));
CREATE POLICY "Admins update certs" ON public.portal_certificates FOR UPDATE USING (public.is_admin() OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'volunteer_manager'));
CREATE POLICY "Admins delete certs" ON public.portal_certificates FOR DELETE USING (public.is_admin() OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'volunteer_manager'));
