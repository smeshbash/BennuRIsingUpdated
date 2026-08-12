-- Comprehensive Supabase RLS Fixes for Delete & Universal Issues

-- 1. Ensure `is_admin()` recognizes volunteer_manager if needed
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
begin
  return (auth.role() = 'authenticated' AND exists (
    select 1 from public.profiles
    where id = auth.uid()
    AND role IN ('super_admin', 'content_manager', 'content_creator', 'volunteer_manager', 'viewer')
  ));
end;
$$;

-- 2. Ensure get_admin_role() returns correctly
CREATE OR REPLACE FUNCTION public.get_admin_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
declare
  r text;
begin
  select role into r from public.profiles where id = auth.uid();
  return r;
end;
$$;


-- 3. Universal Delete Policies for Core Content
DROP POLICY IF EXISTS "Admin delete blog" ON public.blog_posts;
CREATE POLICY "Admin delete blog" ON public.blog_posts FOR DELETE USING (public.get_admin_role() IN ('super_admin', 'content_manager'));

DROP POLICY IF EXISTS "Admin delete albums" ON public.gallery_albums;
CREATE POLICY "Admin delete albums" ON public.gallery_albums FOR DELETE USING (public.get_admin_role() IN ('super_admin', 'content_manager'));

DROP POLICY IF EXISTS "Admin delete images" ON public.gallery_images;
CREATE POLICY "Admin delete images" ON public.gallery_images FOR DELETE USING (public.get_admin_role() IN ('super_admin', 'content_manager'));

DROP POLICY IF EXISTS "Admin delete mission causes" ON public.mission_causes;
CREATE POLICY "Admin delete mission causes" ON public.mission_causes FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Admin delete stats" ON public.impact_stats;
CREATE POLICY "Admin delete stats" ON public.impact_stats FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Admin delete stories" ON public.impact_stories;
CREATE POLICY "Admin delete stories" ON public.impact_stories FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Admin delete team" ON public.team_members;
CREATE POLICY "Admin delete team" ON public.team_members FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Admin delete testimonials" ON public.testimonials;
CREATE POLICY "Admin delete testimonials" ON public.testimonials FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Admin delete funds" ON public.donation_funds;
CREATE POLICY "Admin delete funds" ON public.donation_funds FOR DELETE USING (public.is_admin());


-- 4. Delete Policies for Portal Management (Tasks, Goals, Certs)
ALTER TABLE public.portal_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins delete tasks" ON public.portal_tasks;
CREATE POLICY "Admins delete tasks" ON public.portal_tasks FOR DELETE USING (public.is_admin() OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'volunteer_manager'));

DROP POLICY IF EXISTS "Admins delete goals" ON public.portal_goals;
CREATE POLICY "Admins delete goals" ON public.portal_goals FOR DELETE USING (public.is_admin() OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'volunteer_manager'));

DROP POLICY IF EXISTS "Admins delete certs" ON public.portal_certificates;
CREATE POLICY "Admins delete certs" ON public.portal_certificates FOR DELETE USING (public.is_admin() OR EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'volunteer_manager'));

-- 5. Delete Policies for Profiles & Whitelist
DROP POLICY IF EXISTS "Admin delete whitelist" ON public.admin_whitelist;
CREATE POLICY "Admin delete whitelist" ON public.admin_whitelist FOR DELETE USING (public.is_admin());

DROP POLICY IF EXISTS "Admin delete settings" ON public.system_settings;
CREATE POLICY "Admin delete settings" ON public.system_settings FOR DELETE USING (public.is_admin());

-- 6. Ensure volunteers can update their status correctly
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
