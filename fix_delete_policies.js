import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixPolicies() {
  const sql = `
    -- Explicit DELETE policies for admins
    DROP POLICY IF EXISTS "Admin delete whitelist" ON public.admin_whitelist;
    CREATE POLICY "Admin delete whitelist" ON public.admin_whitelist FOR DELETE USING (public.is_admin());

    DROP POLICY IF EXISTS "Admin delete settings" ON public.system_settings;
    CREATE POLICY "Admin delete settings" ON public.system_settings FOR DELETE USING (public.is_admin());

    DROP POLICY IF EXISTS "Admin delete funds" ON public.donation_funds;
    CREATE POLICY "Admin delete funds" ON public.donation_funds FOR DELETE USING (public.is_admin());

    DROP POLICY IF EXISTS "Admin delete volunteers" ON public.volunteer_applications;
    CREATE POLICY "Admin delete volunteers" ON public.volunteer_applications FOR DELETE USING (public.is_admin());

    DROP POLICY IF EXISTS "Admin delete partners" ON public.partnership_inquiries;
    CREATE POLICY "Admin delete partners" ON public.partnership_inquiries FOR DELETE USING (public.is_admin());

    DROP POLICY IF EXISTS "Admin delete stats" ON public.impact_stats;
    CREATE POLICY "Admin delete stats" ON public.impact_stats FOR DELETE USING (public.is_admin());

    DROP POLICY IF EXISTS "Admin delete stories" ON public.impact_stories;
    CREATE POLICY "Admin delete stories" ON public.impact_stories FOR DELETE USING (public.is_admin());

    DROP POLICY IF EXISTS "Admin delete blog" ON public.blog_posts;
    CREATE POLICY "Admin delete blog" ON public.blog_posts FOR DELETE USING (public.get_admin_role() IN ('super_admin', 'content_manager'));

    DROP POLICY IF EXISTS "Admin delete albums" ON public.gallery_albums;
    CREATE POLICY "Admin delete albums" ON public.gallery_albums FOR DELETE USING (public.get_admin_role() IN ('super_admin', 'content_manager'));

    DROP POLICY IF EXISTS "Admin delete images" ON public.gallery_images;
    CREATE POLICY "Admin delete images" ON public.gallery_images FOR DELETE USING (public.get_admin_role() IN ('super_admin', 'content_manager'));

    DROP POLICY IF EXISTS "Admin delete team" ON public.team_members;
    CREATE POLICY "Admin delete team" ON public.team_members FOR DELETE USING (public.is_admin());

    DROP POLICY IF EXISTS "Admin delete testimonials" ON public.testimonials;
    CREATE POLICY "Admin delete testimonials" ON public.testimonials FOR DELETE USING (public.is_admin());

    DROP POLICY IF EXISTS "Admin delete mission groups" ON public.mission_groups;
    CREATE POLICY "Admin delete mission groups" ON public.mission_groups FOR DELETE USING (public.is_admin());

    DROP POLICY IF EXISTS "Admin delete mission causes" ON public.mission_causes;
    CREATE POLICY "Admin delete mission causes" ON public.mission_causes FOR DELETE USING (public.is_admin());
  `;
  
  // We can't run SQL directly from the client.
  // I will update supabase_schema.sql and tell the user to run it.
}
fixPolicies();
