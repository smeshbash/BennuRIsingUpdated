-- Ensure tables exist and RLS is enabled
ALTER TABLE public.portal_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages_queue ENABLE ROW LEVEL SECURITY;

-- Delete old policies to prevent conflicts
DROP POLICY IF EXISTS "Users can view their own tasks" ON public.portal_tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.portal_tasks;
DROP POLICY IF EXISTS "Admins can do everything on tasks" ON public.portal_tasks;
DROP POLICY IF EXISTS "Users can view their own goals" ON public.portal_goals;
DROP POLICY IF EXISTS "Users can insert own goals" ON public.portal_goals;
DROP POLICY IF EXISTS "Users can update own goals" ON public.portal_goals;
DROP POLICY IF EXISTS "Users can update progress on system goals" ON public.portal_goals;
DROP POLICY IF EXISTS "Admins can do everything on goals" ON public.portal_goals;
DROP POLICY IF EXISTS "Users can view their own certificates" ON public.portal_certificates;
DROP POLICY IF EXISTS "Admins can do everything on certificates" ON public.portal_certificates;
DROP POLICY IF EXISTS "Admins can do everything on whatsapp queue" ON public.whatsapp_messages_queue;

-- Drop new policies to prevent conflict on rerun
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
DROP POLICY IF EXISTS "Users select tasks" ON public.portal_tasks;
DROP POLICY IF EXISTS "Users update tasks" ON public.portal_tasks;
DROP POLICY IF EXISTS "Users select goals" ON public.portal_goals;
DROP POLICY IF EXISTS "Users insert goals" ON public.portal_goals;
DROP POLICY IF EXISTS "Users update goals" ON public.portal_goals;
DROP POLICY IF EXISTS "Users select certs" ON public.portal_certificates;

-- Re-create explicit policies for Admin to ensure DELETE works
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

-- Explicit User Policies
CREATE POLICY "Users select tasks" ON public.portal_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update tasks" ON public.portal_tasks FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users select goals" ON public.portal_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert goals" ON public.portal_goals FOR INSERT WITH CHECK (auth.uid() = user_id AND is_system_goal = false);
CREATE POLICY "Users update goals" ON public.portal_goals FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users select certs" ON public.portal_certificates FOR SELECT USING (auth.uid() = user_id);
