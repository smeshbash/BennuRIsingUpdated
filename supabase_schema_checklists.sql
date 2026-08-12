-- supabase_schema_checklists.sql
CREATE TABLE IF NOT EXISTS public.checklist_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role TEXT NOT NULL CHECK (role IN ('volunteer', 'internship')),
    day INTEGER NOT NULL DEFAULT 1,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(role, day)
);

CREATE TABLE IF NOT EXISTS public.user_checklist_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id INTEGER REFERENCES public.volunteer_applications(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.checklist_templates(id) ON DELETE CASCADE,
    completed_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    custom_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(application_id, template_id)
);

-- Insert default templates
INSERT INTO public.checklist_templates (role, day, items) VALUES
('internship', 1, '[
    {"id": "1", "text": "Saved my donation link", "icon": "Link"},
    {"id": "2", "text": "Sent message to 5 close friends", "icon": "MessageCircle"},
    {"id": "3", "text": "Posted on WhatsApp Status", "icon": "Smartphone"},
    {"id": "4", "text": "Shared on Instagram story", "icon": "Camera"},
    {"id": "5", "text": "Called one family member", "icon": "Phone"},
    {"id": "6", "text": "Got my first donation!", "icon": "PartyPopper"}
]'::jsonb),
('volunteer', 1, '[
    {"id": "1", "text": "Read the volunteer guidelines", "icon": "BookOpen"},
    {"id": "2", "text": "Joined the WhatsApp group", "icon": "MessageCircle"},
    {"id": "3", "text": "Introduced myself to the team", "icon": "Users"},
    {"id": "4", "text": "Reviewed this week''s tasks", "icon": "ListTodo"}
]'::jsonb)
ON CONFLICT (role, day) DO NOTHING;

-- Add RLS
ALTER TABLE public.checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_checklist_progress ENABLE ROW LEVEL SECURITY;

-- Policies for checklist_templates
DROP POLICY IF EXISTS "Public read access for checklist_templates" ON public.checklist_templates;
CREATE POLICY "Public read access for checklist_templates" ON public.checklist_templates FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin full access for checklist_templates" ON public.checklist_templates;
CREATE POLICY "Admin full access for checklist_templates" ON public.checklist_templates FOR ALL USING (public.is_admin());

-- Policies for user_checklist_progress
DROP POLICY IF EXISTS "Public read access for user_checklist_progress" ON public.user_checklist_progress;
DROP POLICY IF EXISTS "Users can read own progress" ON public.user_checklist_progress;
CREATE POLICY "Users can read own progress" ON public.user_checklist_progress FOR SELECT USING (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.volunteer_applications va
    WHERE va.id = user_checklist_progress.application_id
      AND lower(va.email) = lower(auth.jwt() ->> 'email')
  )
);

DROP POLICY IF EXISTS "Public insert access for user_checklist_progress" ON public.user_checklist_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_checklist_progress;
CREATE POLICY "Users can insert own progress" ON public.user_checklist_progress FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.volunteer_applications va
    WHERE va.id = application_id
      AND lower(va.email) = lower(auth.jwt() ->> 'email')
  )
);

DROP POLICY IF EXISTS "Public update access for user_checklist_progress" ON public.user_checklist_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_checklist_progress;
CREATE POLICY "Users can update own progress" ON public.user_checklist_progress FOR UPDATE USING (
  auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.volunteer_applications va
    WHERE va.id = user_checklist_progress.application_id
      AND lower(va.email) = lower(auth.jwt() ->> 'email')
  )
);
DROP POLICY IF EXISTS "Admin full access for user_checklist_progress" ON public.user_checklist_progress;
CREATE POLICY "Admin full access for user_checklist_progress" ON public.user_checklist_progress FOR ALL USING (public.is_admin());
