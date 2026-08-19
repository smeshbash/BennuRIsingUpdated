import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Image,
  Settings,
  LogOut,
  Plus,
  Search,
  Bell,
  User,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Users,
  Eye,
  Edit,
  Trash,
  Upload,
  CircleCheck,
  Lock,
  X,
  ToggleRight,
  ToggleLeft,
  Database,
  Terminal,
  Copy,
  Save,
  TriangleAlert,
  Activity,
  Globe,
  MapPin,
  HandHeart,
  Briefcase,
  Mail,
  MessageSquare,
  Newspaper,
  Shield,
  Key,
  UserPlus,
  CircleX,
  Check,
  Loader2,
  UserCheck,
  BriefcaseBusiness,
  Quote,
  Smile,
  Archive,
  Ban,
  Clock,
  Download,
  BookOpen,
  Video,
  MonitorPlay,
  Code,
  ShieldCheck,
  ShieldAlert,
  RefreshCcw,
  CreditCard,
  LayoutTemplate,
  Heart,
  Sun,
  Sprout,
  GraduationCap,
  CirclePlay,
  Wallet,
  Stethoscope,
  Brain,
  Droplet,
  Scale,
  Tent,
  Palette,
  Sparkles,
  Target,
  Handshake,
  Scale as ScaleIcon,
  Navigation as NavIcon,
  Sliders,
  Type,
  Link as LinkIcon,
  PlugZap,
  ArrowLeft,
  UserCog,
  Layers,
  Calendar,
  LockKeyhole,
  ChevronUp,
  ChevronDown,
  Banknote,
  CheckCircle2,
  AlertCircle,
  ListTodo,
  Award, Pencil,
  Megaphone,
} from "lucide-react";
import {
  BLOG_POSTS,
  GALLERY_ALBUMS,
  IMPACT_STATS,
  IMPACT_STORIES,
  TEAM_MEMBERS,
  TESTIMONIALS,
  DONATION_FUNDS,
  NAV_ITEMS,
  DONATION_TIERS,
  SOCIAL_LINKS,
} from "../constants";
import { useAuth } from "../context/AuthContext";
import { CertificateTemplateManager } from "../components/CertificateTemplateManager";
import { DEFAULT_CERT_TEMPLATES } from "../components/CertificateViewer";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import * as LucideIcons from "lucide-react";

// --- Types ---
type AdminView =
  | "dashboard"
  | "blog"
  | "gallery"
  | "impact"
  | "settings"
  | "setup"
  | "volunteers"
  | "partners"
  | "newsletter"
  | "team"
  | "testimonials"
  | "mission"
  | "funds"
  | "announcements"
  | "legal"
  | "global-config"
  | "admin-users"
  | "checklists"
  | "donations";

let globalConfirm: (msg: string) => Promise<boolean> = async () => true;
let globalAlert: (msg: string) => void = () => {};

export const customConfirm = (msg: string) => globalConfirm(msg);
export const customAlert = (msg: string) => globalAlert(msg);

type AdminRole =
  | "super_admin"
  | "content_manager"
  | "volunteer_manager"
  | "content_creator"
  | "viewer"
  | "stakeholder"
  | "volunteer"
  | "intern";

// Valid Roles Config mapping
const ROLES_CONFIG: Record<AdminRole, { label: string; color: string; desc: string }> = {
  super_admin: {
    label: "Super Admin",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    desc: "Full unrestricted access to all settings and configurations."
  },
  content_manager: {
    label: "Content Manager",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    desc: "Manage site content, pages, impacts, and public facing components."
  },
  volunteer_manager: {
    label: "Volunteer Manager",
    color: "bg-green-100 text-green-700 border-green-200",
    desc: "Manage team, approvals, certificates, and workforce portals."
  },
  content_creator: {
    label: "Content Creator",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    desc: "Create new content but subject to review or cannot manage others' content."
  },
  viewer: {
    label: "Viewer",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    desc: "Read-only access to non-admin dashboard parts."
  },
  stakeholder: {
    label: "Stakeholder",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    desc: "Management & Advisory Board. View non-admin portions of dashboard."
  },
  volunteer: {
    label: "Volunteer",
    color: "bg-teal-100 text-teal-700 border-teal-200",
    desc: "Assigned volunteer role, access limited to Volunteer Portal."
  },
  intern: {
    label: "Intern",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
    desc: "Assigned intern role, access limited to Intern Portal."
  }
};

// Valid Icons for Picker
const VALID_ICONS = [
  "Heart",
  "Activity",
  "Brain",
  "Stethoscope",
  "Users",
  "Droplet",
  "GraduationCap",
  "Briefcase",
  "Tent",
  "HandHeart",
  "Scale",
  "Sun",
  "Sparkles",
  "Palette",
  "Shield",
  "Sprout",
  "Globe",
  "Zap",
  "Award",
  "BookOpen",
  "Smile",
  "Star",
  "Anchor",
  "Leaf",
  "Accessibility",
  "Landmark",
  "HeartHandshake",
  "Target",
  "Search",
  "Puzzle",
];

const ImageUpload = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (uploadError) {
      customAlert("Error uploading image: " + uploadError.message);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(filePath);

    onChange(publicUrl);
    setUploading(false);
  };

  return (
    <div className="w-full border p-2 rounded-lg flex flex-col gap-2 bg-white">
      {value && (
        <img
          src={value}
          alt="Preview"
          className="h-20 object-contain rounded bg-gray-50"
        />
      )}
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {uploading && (
          <Loader2 className="w-4 h-4 animate-spin text-brand-blue" />
        )}
      </div>
      <input
        placeholder="Or enter Image URL manually"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-t border-gray-100 pt-2 mt-1 outline-none text-sm bg-transparent"
      />
    </div>
  );
};

// --- SQL Script Generator ---
const GENERATED_SQL = `
-- Bennu Rising - New Improved Secured Schema
-- This schema implements a UUID-linked Profiles table for robust RBAC.

-- 1. Create Tables
-- Update existing identity columns to GENERATED BY DEFAULT
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT table_name, column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND is_identity = 'YES'
          AND identity_generation = 'ALWAYS'
    LOOP
        EXECUTE format('ALTER TABLE public.%I ALTER COLUMN %I SET GENERATED BY DEFAULT', r.table_name, r.column_name);
    END LOOP;
END $$;

-- Legacy Whitelist (Keep for migration and initial authorization)
CREATE TABLE IF NOT EXISTS public.admin_whitelist (
    email text NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    role text DEFAULT 'content_manager'::text
);

-- NEW: Profiles Table (Linked to Auth.Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email text UNIQUE NOT NULL,
    role text DEFAULT 'content_manager'::text,
    full_name text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
    id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    title text,
    excerpt text,
    content text,
    author text,
    image_url text,
    category text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    approval_status text DEFAULT 'published'::text,
    author_email text,
    author_id uuid REFERENCES public.profiles(id),
    reviewer_comments text
);

CREATE TABLE IF NOT EXISTS public.donation_funds (
    id text NOT NULL PRIMARY KEY,
    name text NOT NULL,
    is_active boolean DEFAULT true,
    display_order integer GENERATED BY DEFAULT AS IDENTITY
);

CREATE TABLE IF NOT EXISTS public.donations (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    donor_name text,
    donor_email text,
    amount numeric,
    fund_id text REFERENCES public.donation_funds(id),
    status text,
    payment_id text,
    frequency text,
    pan_number text,
    is_verified boolean DEFAULT false,
    volunteer_id integer, -- Linked in trigger/app logic
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.gallery_albums (
    id text NOT NULL PRIMARY KEY,
    title text,
    cover_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    approval_status text DEFAULT 'published'::text,
    author_email text,
    author_id uuid REFERENCES public.profiles(id),
    reviewer_comments text
);

CREATE TABLE IF NOT EXISTS public.gallery_images (
    id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    album_id text REFERENCES public.gallery_albums(id) ON DELETE CASCADE,
    image_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.impact_stats (
    id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    label text,
    value text,
    description text,
    display_order integer GENERATED BY DEFAULT AS IDENTITY,
    approval_status text DEFAULT 'published'::text,
    author_email text,
    author_id uuid REFERENCES public.profiles(id),
    reviewer_comments text
);

CREATE TABLE IF NOT EXISTS public.impact_stories (
    id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    title text,
    description text,
    author text,
    location text,
    image_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    approval_status text DEFAULT 'published'::text,
    author_email text,
    author_id uuid REFERENCES public.profiles(id),
    reviewer_comments text
);

CREATE TABLE IF NOT EXISTS public.mission_groups (
    id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    title text,
    description text,
    color text,
    icon text,
    display_order integer GENERATED BY DEFAULT AS IDENTITY
);

CREATE TABLE IF NOT EXISTS public.mission_causes (
    id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    group_id integer REFERENCES public.mission_groups(id) ON DELETE CASCADE,
    title text,
    description text,
    icon text,
    display_order integer GENERATED BY DEFAULT AS IDENTITY,
    approval_status text DEFAULT 'published'::text,
    author_email text,
    author_id uuid REFERENCES public.profiles(id),
    reviewer_comments text
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    email text UNIQUE,
    subscribed_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.partnership_inquiries (
    id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    contact_name text,
    organization text,
    email text,
    phone text,
    inquiry_type text,
    message text,
    status text DEFAULT 'new'::text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.system_settings (
    key text NOT NULL PRIMARY KEY,
    value text,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.team_members (
    id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name text,
    role text,
    bio text,
    image_url text,
    display_order integer GENERATED BY DEFAULT AS IDENTITY,
    approval_status text DEFAULT 'published'::text,
    author_email text,
    author_id uuid REFERENCES public.profiles(id),
    reviewer_comments text
);

CREATE TABLE IF NOT EXISTS public.testimonials (
    id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name text,
    role text,
    content text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    approval_status text DEFAULT 'published'::text,
    author_email text,
    author_id uuid REFERENCES public.profiles(id),
    reviewer_comments text
);

CREATE TABLE IF NOT EXISTS public.volunteer_applications (
    id integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    first_name text,
    last_name text,
    email text,
    phone text,
    interest text,
    status text DEFAULT 'pending'::text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    amount_paid numeric,
    payment_id text,
    application_type text DEFAULT 'volunteer'::text
);

-- Ensure author_id columns exist (for migration of existing tables)
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS author_id uuid REFERENCES public.profiles(id);
ALTER TABLE public.gallery_albums ADD COLUMN IF NOT EXISTS author_id uuid REFERENCES public.profiles(id);
ALTER TABLE public.impact_stats ADD COLUMN IF NOT EXISTS author_id uuid REFERENCES public.profiles(id);
ALTER TABLE public.impact_stories ADD COLUMN IF NOT EXISTS author_id uuid REFERENCES public.profiles(id);
ALTER TABLE public.mission_causes ADD COLUMN IF NOT EXISTS author_id uuid REFERENCES public.profiles(id);
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS author_id uuid REFERENCES public.profiles(id);
ALTER TABLE public.partnership_inquiries ADD COLUMN IF NOT EXISTS logo_url text;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS author_id uuid REFERENCES public.profiles(id);

-- 2. Functions & Triggers

-- Function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(
      (SELECT role FROM public.admin_whitelist WHERE lower(email) = lower(new.email)),
      'content_manager'
    )
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Improved is_admin function (UUID based)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
begin
  return (auth.role() = 'authenticated' AND exists (
    select 1 from public.profiles
    where id = auth.uid()
    AND role IN ('super_admin', 'content_manager', 'content_creator')
  ));
end;
$$;

-- Improved get_admin_role function (UUID based)
CREATE OR REPLACE FUNCTION public.get_admin_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  RETURN user_role;
END;
$$;

-- 3. Seed Data

INSERT INTO public.admin_whitelist (email, role) VALUES
('ronin@bennurising.org', 'super_admin'),
('sreerampillai158@gmail.com', 'super_admin'),
('supersain18@gmail.com', 'super_admin'),
('YOUR_ADMIN_EMAIL', 'super_admin')
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role;

-- Migration: Create profiles for existing auth users who are in the whitelist
INSERT INTO public.profiles (id, email, role)
SELECT u.id, u.email, w.role
FROM auth.users u
JOIN public.admin_whitelist w ON lower(u.email) = lower(w.email)
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;

INSERT INTO public.donation_funds (id, name, is_active) VALUES
('general', 'General Fund (Where Needed Most)', true),
('armed_forces', 'Armed Forces & Police Welfare', true),
('mental_health', 'Mental Health & Rehab Centers', true),
('tribal_edu', 'Tribal Education & Girl Child', true),
('medical', 'Medical Aid (Cancer/Thalassemia/Autism)', true),
('disaster', 'Disaster Relief & Environment', true)
ON CONFLICT DO NOTHING;

-- 4. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_causes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are readable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are readable by everyone" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- Whitelist Policies
DROP POLICY IF EXISTS "Admins manage whitelist" ON public.admin_whitelist;
CREATE POLICY "Admins manage whitelist" ON public.admin_whitelist USING (public.is_admin());

-- Content Policies (Using new UUID-based functions)
DROP POLICY IF EXISTS "Public read albums" ON public.gallery_albums;
CREATE POLICY "Public read albums" ON public.gallery_albums FOR SELECT USING (approval_status = 'published' OR public.is_admin());
DROP POLICY IF EXISTS "Public read blog" ON public.blog_posts;
CREATE POLICY "Public read blog" ON public.blog_posts FOR SELECT USING (approval_status = 'published' OR public.is_admin());
DROP POLICY IF EXISTS "Public read funds" ON public.donation_funds;
CREATE POLICY "Public read funds" ON public.donation_funds FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read images" ON public.gallery_images;
CREATE POLICY "Public read images" ON public.gallery_images FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read mission causes" ON public.mission_causes;
CREATE POLICY "Public read mission causes" ON public.mission_causes FOR SELECT USING (approval_status = 'published' OR public.is_admin());
DROP POLICY IF EXISTS "Public read mission groups" ON public.mission_groups;
CREATE POLICY "Public read mission groups" ON public.mission_groups FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read settings" ON public.system_settings;
CREATE POLICY "Public read settings" ON public.system_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read stats" ON public.impact_stats;
CREATE POLICY "Public read stats" ON public.impact_stats FOR SELECT USING (approval_status = 'published' OR public.is_admin());
DROP POLICY IF EXISTS "Public read stories" ON public.impact_stories;
CREATE POLICY "Public read stories" ON public.impact_stories FOR SELECT USING (approval_status = 'published' OR public.is_admin());
DROP POLICY IF EXISTS "Public read team" ON public.team_members;
CREATE POLICY "Public read team" ON public.team_members FOR SELECT USING (approval_status = 'published' OR public.is_admin());
DROP POLICY IF EXISTS "Public read testimonials" ON public.testimonials;
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (approval_status = 'published' OR public.is_admin());

-- Admin/Manager Full Access
DROP POLICY IF EXISTS "Managers manage albums" ON public.gallery_albums;
CREATE POLICY "Managers manage albums" ON public.gallery_albums FOR ALL USING (public.get_admin_role() IN ('super_admin', 'content_manager'));
DROP POLICY IF EXISTS "Managers manage blog" ON public.blog_posts;
CREATE POLICY "Managers manage blog" ON public.blog_posts FOR ALL USING (public.get_admin_role() IN ('super_admin', 'content_manager'));
DROP POLICY IF EXISTS "Managers manage mission causes" ON public.mission_causes;
CREATE POLICY "Managers manage mission causes" ON public.mission_causes FOR ALL USING (public.get_admin_role() IN ('super_admin', 'content_manager'));
DROP POLICY IF EXISTS "Managers manage stats" ON public.impact_stats;
CREATE POLICY "Managers manage stats" ON public.impact_stats FOR ALL USING (public.get_admin_role() IN ('super_admin', 'content_manager'));
DROP POLICY IF EXISTS "Managers manage stories" ON public.impact_stories;
CREATE POLICY "Managers manage stories" ON public.impact_stories FOR ALL USING (public.get_admin_role() IN ('super_admin', 'content_manager'));
DROP POLICY IF EXISTS "Managers manage team" ON public.team_members;
CREATE POLICY "Managers manage team" ON public.team_members FOR ALL USING (public.get_admin_role() IN ('super_admin', 'content_manager'));
DROP POLICY IF EXISTS "Managers manage testimonials" ON public.testimonials;
CREATE POLICY "Managers manage testimonials" ON public.testimonials FOR ALL USING (public.get_admin_role() IN ('super_admin', 'content_manager'));

-- Creator Policies
DROP POLICY IF EXISTS "Creators manage own blog" ON public.blog_posts;
CREATE POLICY "Creators manage own blog" ON public.blog_posts FOR ALL USING (public.get_admin_role() = 'content_creator' AND author_id = auth.uid());
DROP POLICY IF EXISTS "Creators manage own albums" ON public.gallery_albums;
CREATE POLICY "Creators manage own albums" ON public.gallery_albums FOR ALL USING (public.get_admin_role() = 'content_creator' AND author_id = auth.uid());
DROP POLICY IF EXISTS "Creators manage own stats" ON public.impact_stats;
CREATE POLICY "Creators manage own stats" ON public.impact_stats FOR ALL USING (public.get_admin_role() = 'content_creator' AND author_id = auth.uid());
DROP POLICY IF EXISTS "Creators manage own stories" ON public.impact_stories;
CREATE POLICY "Creators manage own stories" ON public.impact_stories FOR ALL USING (public.get_admin_role() = 'content_creator' AND author_id = auth.uid());
DROP POLICY IF EXISTS "Creators manage own mission causes" ON public.mission_causes;
CREATE POLICY "Creators manage own mission causes" ON public.mission_causes FOR ALL USING (public.get_admin_role() = 'content_creator' AND author_id = auth.uid());
DROP POLICY IF EXISTS "Creators manage own team" ON public.team_members;
CREATE POLICY "Creators manage own team" ON public.team_members FOR ALL USING (public.get_admin_role() = 'content_creator' AND author_id = auth.uid());
DROP POLICY IF EXISTS "Creators manage own testimonials" ON public.testimonials;
CREATE POLICY "Creators manage own testimonials" ON public.testimonials FOR ALL USING (public.get_admin_role() = 'content_creator' AND author_id = auth.uid());

-- Public Submissions
DROP POLICY IF EXISTS "Public insert donations" ON public.donations;
CREATE POLICY "Public insert donations" ON public.donations FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin read donations" ON public.donations;
CREATE POLICY "Admin read donations" ON public.donations FOR SELECT USING (public.is_admin());
DROP POLICY IF EXISTS "Public insert newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Public insert newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public insert partners" ON public.partnership_inquiries;
CREATE POLICY "Public insert partners" ON public.partnership_inquiries FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public read active partners" ON public.partnership_inquiries;
CREATE POLICY "Public read active partners" ON public.partnership_inquiries FOR SELECT USING (status = 'active');
DROP POLICY IF EXISTS "Public insert volunteers" ON public.volunteer_applications;
CREATE POLICY "Public insert volunteers" ON public.volunteer_applications FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin read volunteers" ON public.volunteer_applications;
CREATE POLICY "Admin read volunteers" ON public.volunteer_applications FOR SELECT USING (public.is_admin());

-- Storage Policies
-- (Assumes 'images' bucket exists)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'images' );
DROP POLICY IF EXISTS "Admin Upload Access" ON storage.objects;
CREATE POLICY "Admin Upload Access" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'images' AND public.is_admin() );
DROP POLICY IF EXISTS "Admin Update Access" ON storage.objects;
CREATE POLICY "Admin Update Access" ON storage.objects FOR UPDATE USING ( bucket_id = 'images' AND public.is_admin() );
DROP POLICY IF EXISTS "Admin Delete Access" ON storage.objects;
CREATE POLICY "Admin Delete Access" ON storage.objects FOR DELETE USING ( bucket_id = 'images' AND public.is_admin() );
\`;

`;

// --- Helpers ---
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

// --- Components ---

const PermissionBanner = ({ role }: { role: string | null }) => {
  const { user } = useAuth();
  const accessText = role
    ? ROLES_CONFIG[role as AdminRole]?.label || "Viewer"
    : "No Access";
  const accessColor = role
    ? ROLES_CONFIG[role as AdminRole]?.color
    : "bg-red-100 text-red-700";

  if (!role) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl shadow-sm animate-fade-in-up mx-8">
        <div className="flex justify-between items-start">
          <div className="flex">
            <div className="flex-shrink-0">
              <ShieldAlert
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Restricted Access
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  Your email <strong>{user?.email}</strong> is not in the admin
                  whitelist or has no assigned role.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-100 p-4 mb-8 rounded-2xl shadow-sm mx-8 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-brand-blue font-bold border border-blue-100">
          {user?.email?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm text-gray-500 font-bold">Logged in as</p>
          <p className="text-gray-800 font-bold">{user?.email}</p>
        </div>
      </div>
      <div
        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border ${accessColor}`}
      >
        {accessText}
      </div>
    </div>
  );
};

const AdminUsersManager = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<AdminRole>("content_manager");
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    if (isSupabaseConfigured()) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .neq("is_deleted", true)
        .order("created_at", { ascending: false });
      const { data: whitelist } = await supabase
        .from("admin_whitelist")
        .select("*")
        .neq("is_deleted", true)
        .order("created_at", { ascending: false });

      if (profiles && whitelist) {
        const activeEmails = new Set(
          profiles.map((p) => p.email.toLowerCase()),
        );
        const pending = whitelist.filter(
          (w) =>
            !activeEmails.has(w.email.toLowerCase()) &&
            w.email !== "supersain18@gmail.com",
        );
        const active = profiles.filter(
          (p) => p.email !== "supersain18@gmail.com" && ['super_admin', 'content_manager', 'content_creator', 'volunteer_manager'].includes(p.role),
        );

        setUsers(active);
        setPendingUsers(pending);
      }
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    
    if (!isSupabaseConfigured()) {
      customAlert("Supabase is not configured.");
      return;
    }
    
    setLoading(true);
    
    try {
      // First add to whitelist
      const { error } = await supabase
        .from("admin_whitelist")
        .insert({ email: newEmail.toLowerCase(), role: newRole });
        
      if (error) {
        setLoading(false);
        customAlert("Error: " + error.message);
        return;
      }

      // If the user already exists in profiles, update their role directly
      await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("email", newEmail.toLowerCase());

      // Try to sign up the user with a random temporary password
      // This will send a Signup Confirmation email with a magic link
      const tempPassword = Math.random().toString(36).slice(-12) + "A1@";
      const { error: signUpError } = await supabase.auth.signUp({
        email: newEmail.toLowerCase(),
        password: tempPassword,
        options: { 
          emailRedirectTo: window.location.origin + "/admin/dashboard?send_reset=true",
        }
      });

      setLoading(false);
      
      let msg = "";
      if (signUpError) {
        if (signUpError.message.toLowerCase().includes("user already registered")) {
           // If user exists, send password reset link
           const { error: resetError } = await supabase.auth.resetPasswordForEmail(
              newEmail.toLowerCase(),
              { redirectTo: window.location.origin + "/admin/dashboard" }
           );
           if (resetError) {
              msg = `User ${newEmail} pre-authorized, but failed sending reset link: ${resetError.message}`;
           } else {
              msg = `User ${newEmail} pre-authorized. An existing account was found, so a password reset link has been sent instead.`;
           }
        } else {
           msg = `User ${newEmail} pre-authorized in whitelist. Invite email failed: ${signUpError.message}. Ask them to manually 'Sign Up' on the admin page.`;
        }
      } else {
        msg = `User ${newEmail} pre-authorized! Supabase has sent a signup confirmation link. \n\nNote: They will appear as 'Pending' until they click the link/sign up (which creates their profile).`;
      }
      customAlert(msg);
      
      setNewEmail("");
      fetchUsers();
    } catch (err: any) {
      setLoading(false);
      console.error("addUser Error:", err);
      customAlert(`Error adding user: ${err.message || 'Failed to fetch. Please check your network or Supabase URL configuration.'}`);
    }
  };

  const deleteUser = async (id: string | null, email: string) => {
    if (await customConfirm(`Remove access for ${email}?`)) {
      if (id) await supabase.from("profiles").update({ is_deleted: true }).eq("id", id);
      const { error } = await supabase
        .from("admin_whitelist")
        .update({ is_deleted: true })
        .eq("email", email);
      if (error) customAlert("Error: " + error.message);
      else fetchUsers();
    }
  };

  const updateRole = async (id: string | null, email: string, role: string) => {
    if (id) await supabase.from("profiles").update({ role }).eq("id", id);
    const { error } = await supabase
      .from("admin_whitelist")
      .update({ role })
      .eq("email", email);
    if (error) customAlert("Error: " + error.message);
    else fetchUsers();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-brand-blue">
        Admin Access Control
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <UserPlus className="w-4 h-4 mr-2" /> Authorize New Admin
          </h3>
          <form onSubmit={addUser} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Email
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full border p-3 rounded-xl mt-1 focus:ring-2 focus:ring-brand-blue/20 outline-none"
                placeholder="e.g., newadmin@example.com"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Role
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as AdminRole)}
                className="w-full border p-3 rounded-xl mt-1 bg-white focus:ring-2 focus:ring-brand-blue/20 outline-none cursor-pointer"
              >
                <option value="super_admin">Super Admin</option>
                <option value="content_manager">Content Manager</option>
                <option value="content_creator">Content Creator</option>
                <option value="volunteer_manager">Volunteer Manager</option>
                <option value="viewer">Viewer</option>
                <option value="stakeholder">Stakeholder</option>
                <option value="volunteer">Volunteer</option>
                <option value="intern">Intern</option>
              </select>
            </div>
            <button
              disabled={loading}
              className="w-full bg-brand-blue text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center hover:bg-brand-dark transition shadow-lg shadow-brand-blue/20"
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                "Authorize User"
              )}
            </button>
          </form>
        </div>
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <ShieldCheck className="w-4 h-4 mr-2" /> Active Admin Profiles
            </h3>
            <div className="space-y-3">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex flex-col md:flex-row justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100 gap-4"
                >
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 text-gray-600 font-bold">
                      {u.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-sm font-bold text-gray-800 truncate">
                        {u.email}
                      </div>
                      <div className="text-xs text-gray-500">
                        Joined: {new Date(u.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <select
                      value={u.role || "content_manager"}
                      onChange={(e) =>
                        updateRole(u.id, u.email, e.target.value)
                      }
                      className={`text-xs font-bold px-3 py-2 rounded-lg border-none outline-none cursor-pointer appearance-none ${ROLES_CONFIG[u.role as AdminRole]?.color || "bg-gray-200 text-gray-700"}`}
                    >
                      <option value="super_admin">Super Admin</option>
                      <option value="content_manager">Content Manager</option>
                      <option value="content_creator">Content Creator</option>
                      <option value="volunteer_manager">
                        Volunteer Manager
                      </option>
                      <option value="viewer">Viewer</option>
                      <option value="stakeholder">Stakeholder</option>
                      <option value="volunteer">Volunteer</option>
                      <option value="intern">Intern</option>
                    </select>
                    <button
                      onClick={() => deleteUser(u.id, u.email)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {users.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-4">
                  No active profiles found.
                </p>
              )}
            </div>
          </div>
          {pendingUsers.length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <Clock className="w-4 h-4 mr-2" /> Pending Authorizations
              </h3>
              <div className="space-y-3">
                {pendingUsers.map((u) => (
                  <div
                    key={u.email}
                    className="flex flex-col md:flex-row justify-between items-center p-4 bg-yellow-50/50 rounded-xl border border-yellow-100 gap-4"
                  >
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-yellow-200 text-yellow-600 font-bold">
                        {u.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-sm font-bold text-gray-800 truncate">
                          {u.email}
                        </div>
                        <div className="text-xs text-gray-500">
                          Authorized:{" "}
                          {new Date(u.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <select
                        value={u.role || "content_manager"}
                        onChange={(e) =>
                          updateRole(null, u.email, e.target.value)
                        }
                        className={`text-xs font-bold px-3 py-2 rounded-lg border-none outline-none cursor-pointer appearance-none ${ROLES_CONFIG[u.role as AdminRole]?.color || "bg-gray-200 text-gray-700"}`}
                      >
                        <option value="super_admin">Super Admin</option>
                        <option value="content_manager">Content Manager</option>
                        <option value="content_creator">Content Creator</option>
                        <option value="volunteer_manager">
                          Volunteer Manager
                        </option>
                        <option value="viewer">Viewer</option>
                        <option value="stakeholder">Stakeholder</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="intern">Intern</option>
                      </select>
                      <button
                        onClick={() => deleteUser(null, u.email)}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const OverviewStats = () => {
  const [stats, setStats] = useState({
    donations: 0,
    workforce: 0,
    partners: 0,
    totalAmount: 0,
  });
  useEffect(() => {
    const fetchStats = async () => {
      if (isSupabaseConfigured()) {
        const { count: dCount } = await supabase
          .from("donations")
          .select("*", { count: "exact", head: true })
          .eq("status", "success");
        const { count: wCount } = await supabase
          .from("volunteer_applications")
          .select("*", { count: "exact", head: true });
        const { count: pCount } = await supabase
          .from("partnership_inquiries")
          .select("*", { count: "exact", head: true });

        // Fetch successful donations to sum the amount
        const { data: dData } = await supabase
          .from("donations")
          .select("amount")
          .eq("status", "success");
        const totalAmount =
          dData?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) ||
          0;

        setStats({
          donations: dCount || 0,
          workforce: wCount || 0,
          partners: pCount || 0,
          totalAmount,
        });
      }
    };
    fetchStats();
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500 font-bold uppercase text-xs">
            Total Funds Sourced
          </h3>
          <div className="p-2 bg-emerald-50 rounded-lg">
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-800">
          ₹{stats.totalAmount.toLocaleString()}
        </p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500 font-bold uppercase text-xs">
            Donation Count
          </h3>
          <div className="p-2 bg-green-50 rounded-lg">
            <Heart className="w-5 h-5 text-green-600" />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-800">{stats.donations}</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500 font-bold uppercase text-xs">
            Workforce
          </h3>
          <div className="p-2 bg-blue-50 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-800">{stats.workforce}</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-500 font-bold uppercase text-xs">
            Partners
          </h3>
          <div className="p-2 bg-purple-50 rounded-lg">
            <Handshake className="w-5 h-5 text-purple-600" />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-800">{stats.partners}</p>
      </div>
    </div>
  );
};

const DonationsManager = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<
    "all" | "success" | "failed" | "pending"
  >("all");

  const fetchDonations = async () => {
    if (!isSupabaseConfigured()) return;
    setLoading(true);
    try {
      let query = supabase
        .from("donations")
        .select("*, volunteer:volunteer_applications(first_name, last_name)")
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setDonations(data || []);
    } catch (err: any) {
      console.error("Error fetching donations:", err);
      customAlert("Failed to load donations: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [filter]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-blue">
          Donations & Finance
        </h2>
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium focus:ring-2 focus:ring-brand-blue/20 outline-none"
          >
            <option value="all">All Donations</option>
            <option value="success">Successful</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>
          <button
            onClick={fetchDonations}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold transition-colors flex items-center"
          >
            <RefreshCcw className="w-4 h-4 mr-2" /> Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Donor</th>
                <th className="p-4 font-bold">Amount</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Fund ID</th>
                <th className="p-4 font-bold">Volunteer/Intern</th>
                <th className="p-4 font-bold">Payment ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />{" "}
                    Loading donations...
                  </td>
                </tr>
              ) : donations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    No donations found.
                  </td>
                </tr>
              ) : (
                donations.map((d, i) => (
                  <tr
                    key={d.id || i}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(d.created_at).toLocaleDateString()}{" "}
                      <span className="text-xs text-gray-400">
                        {new Date(d.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-800">
                        {d.donor_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {d.donor_email}
                      </div>
                      {d.pan_number && (
                        <div className="text-[10px] text-gray-400 font-mono mt-1">
                          PAN: {d.pan_number}
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-bold text-brand-dark">
                      ₹{Number(d.amount).toLocaleString()}
                      {d.frequency === "monthly" && (
                        <span className="ml-2 text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Monthly
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          d.status === "success"
                            ? "bg-green-100 text-green-800"
                            : d.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {d.status}
                      </span>
                      {d.is_verified && (
                        <CheckCircle2 className="w-3 h-3 text-green-500 inline-block ml-1" />
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-600">{d.fund_id}</td>
                    <td className="p-4 text-sm">
                      {d.volunteer ? (
                        <span className="font-medium text-brand-blue bg-blue-50 px-2 py-1 rounded-md">
                          {d.volunteer.first_name} {d.volunteer.last_name}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Direct</span>
                      )}
                    </td>
                    <td className="p-4 text-xs font-mono text-gray-500">
                      {d.payment_id}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const VolunteerPortalManager = ({
  volunteer,
  onClose,
}: {
  volunteer: any;
  onClose: () => void;
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);
  const [certTemplates, setCertTemplates] = useState<any[]>([]);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskDue, setNewTaskDue] = useState("");

  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDesc, setNewGoalDesc] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState(100);
  const [newGoalUnit, setNewGoalUnit] = useState("");

  const [newCertType, setNewCertType] = useState("intern");

  useEffect(() => {
    const init = async () => {
      // Find user profile by email
      const [{ data: profile }, { data: settingsData }] = await Promise.all([
           supabase.from("profiles").select("id").eq("email", volunteer.email).single(),
           supabase.from('system_settings').select('value').eq('key', 'certificate_templates').single()
      ]);
      if (settingsData?.value) {
          try {
              const parsed = typeof settingsData.value === 'string' ? JSON.parse(settingsData.value) : settingsData.value;
              if (Array.isArray(parsed) && parsed.length > 0) {
                  setCertTemplates(parsed);
                  setNewCertType(parsed[0].id);
              } else {
                  setCertTemplates(DEFAULT_CERT_TEMPLATES);
                  setNewCertType(DEFAULT_CERT_TEMPLATES[0].id);
              }
          } catch {
              setCertTemplates(DEFAULT_CERT_TEMPLATES);
              setNewCertType(DEFAULT_CERT_TEMPLATES[0].id);
          }
      } else {
          setCertTemplates(DEFAULT_CERT_TEMPLATES);
          setNewCertType(DEFAULT_CERT_TEMPLATES[0].id);
      }
      
      if (profile) {
        setUserId(profile.id);
        fetchData(profile.id);
      } else {
        setLoading(false);
      }
    };
    init();
  }, [volunteer]);

  const fetchData = async (uid: string) => {
    setLoading(true);
    const [tRes, gRes, cRes] = await Promise.all([
      supabase
        .from("portal_tasks")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: false }),
      supabase
        .from("portal_goals")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: false }),
      supabase
        .from("portal_certificates")
        .select("*")
        .neq("is_deleted", true)
        .eq("user_id", uid)
        .order("created_at", { ascending: false }),
    ]);
    if (tRes.data) setTasks(tRes.data);
    if (gRes.data) setGoals(gRes.data);
    if (cRes.data) setCerts(cRes.data);
    setLoading(false);
  };

  const addTask = async () => {
    if (!userId || !newTaskTitle) return;
    const { data, error } = await supabase
      .from("portal_tasks")
      .insert([
        {
          user_id: userId,
          title: newTaskTitle,
          description: newTaskDesc,
          due_date: newTaskDue || null,
          status: "pending",
        },
      ])
      .select()
      .single();
    if (data) {
      setTasks([data, ...tasks]);
      setNewTaskTitle("");
      setNewTaskDesc("");
      setNewTaskDue("");
    }
    if (error) alert(error.message);
  };

  const addSystemGoal = async () => {
    if (!userId || !newGoalTitle) return;

    const { data, error } = await supabase
      .from("portal_goals")
      .insert([
        {
          user_id: userId,
          title: newGoalTitle,
          description: newGoalDesc,
          target_value: newGoalTarget,
          unit: newGoalUnit,
          is_system_goal: true,
        },
      ])
      .select()
      .single();
    if (data) {
      setGoals([data, ...goals]);
      setNewGoalTitle("");
      setNewGoalDesc("");
      setNewGoalTarget(100);
      setNewGoalUnit("");
    }
    if (error) alert(error.message);
  };

  const revokeGoal = async (id: number) => {
    if (!confirm("Are you sure you want to revoke this goal?")) return;
    const { error } = await supabase
      .from("portal_goals")
      .update({ is_deleted: true })
      .eq("id", id);
    if (!error) {
      setGoals(goals.filter(g => g.id !== id));
    } else {
      alert(error.message);
    }
  };

  const issueCert = async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("portal_certificates")
      .insert([
        {
          user_id: userId,
          certificate_type: newCertType,
          status: "issued",
        },
      ])
      .select()
      .single();
    if (data) setCerts([data, ...certs]);
    if (error) alert(error.message);
  };

  const updateCertStatus = async (id: number, status: string) => {
    const { data, error } = await supabase
      .from("portal_certificates")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    if (data) setCerts(certs.map((c) => (c.id === id ? data : c)));
    if (error) alert(error.message);
  };

  const revokeCert = async (id: number) => {
    if (!confirm("Are you sure you want to revoke/delete this certificate?")) return;
    const { data, error } = await supabase
      .from("portal_certificates")
      .update({ is_deleted: true })
      .eq("id", id)
      .select();
    
    if (error) {
      alert(error.message);
    } else if (data && data.length === 0) {
      alert("Permission Denied: Missing Update permissions or record not found.");
    } else {
      setCerts(certs.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex bg-black/50 backdrop-blur-sm animate-fade-in justify-end">
      <div className="bg-white w-full max-w-2xl h-full overflow-y-auto shadow-2xl p-6 lg:p-10 animate-slide-in-right">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manage Portal</h2>
            <p className="text-gray-500">
              {volunteer.first_name} {volunteer.last_name} (
              {volunteer.application_type})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
          </div>
        ) : !userId ? (
          <div className="bg-yellow-50 text-yellow-800 p-6 rounded-2xl border border-yellow-200">
            <AlertCircle className="w-8 h-8 mb-4 opacity-50" />
            <h3 className="font-bold text-lg mb-2">Account Not Activated</h3>
            <p className="mb-4">
              This volunteer has not logged into the portal yet. Portal management
              becomes available after their first sign-in.
            </p>
            <p className="border-t border-yellow-200/50 pt-4 mt-2 text-sm text-yellow-900">
              <strong>Action needed:</strong> Please instruct the volunteer to visit the <strong>Contributor Portal (/portal)</strong> and enter their email (<strong>{volunteer.email}</strong>) to activate their account.
            </p>
          </div>
        ) : (
          <div className="space-y-10 pb-20">
            {/* Tasks Section */}
            <section>
              <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                <ListTodo className="w-5 h-5 mr-2 text-brand-blue" /> Daily Work
                Items
              </h3>
              <div className="bg-gray-50 p-4 rounded-xl mb-4 space-y-3">
                <div>
                  <input
                    placeholder="Task Title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full border p-2 rounded-lg"
                  />
                </div>
                <div>
                  <input
                    placeholder="Description"
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    className="w-full border p-2 rounded-lg"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={newTaskDue}
                    onChange={(e) => setNewTaskDue(e.target.value)}
                    className="border p-2 rounded-lg flex-1"
                  />
                  <button
                    onClick={addTask}
                    className="bg-brand-blue text-white px-4 font-bold rounded-lg hover:bg-blue-700"
                  >
                    Assign Task
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {tasks.map((t) => (
                  <div
                    key={t.id}
                    className="border p-3 rounded-lg flex justify-between items-center bg-white shadow-sm"
                  >
                    <div>
                      <h4 className="font-bold">{t.title}</h4>
                      <p className="text-xs text-gray-500">{t.description}</p>
                    </div>
                    <div className="text-xs font-bold px-2 py-1 bg-gray-100 rounded uppercase">
                      {t.status.replace("_", " ")}
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-xs text-gray-400 italic">
                    No tasks assigned.
                  </p>
                )}
              </div>
            </section>

            {/* Goals Section */}
            <section>
              <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-brand-blue" /> Goals
                Tracker
              </h3>
              <div className="bg-gray-50 p-4 rounded-xl mb-4 space-y-3">
                <div>
                  <input
                    placeholder="System Goal Title"
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    className="w-full border p-2 rounded-lg"
                  />
                </div>
                <div>
                  <input
                    placeholder="Description"
                    value={newGoalDesc}
                    onChange={(e) => setNewGoalDesc(e.target.value)}
                    className="w-full border p-2 rounded-lg"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={newGoalTarget}
                    onChange={(e) =>
                      setNewGoalTarget(parseInt(e.target.value) || 0)
                    }
                    placeholder="Target Qty (e.g. 100)"
                    title="Numeric Target Quantity"
                    className="border p-2 rounded-lg w-1/3"
                  />
                  <input
                    type="text"
                    value={newGoalUnit}
                    onChange={(e) => setNewGoalUnit(e.target.value)}
                    placeholder="Unit (e.g. Rupees, Hours, Items)"
                    className="border p-2 rounded-lg flex-1"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={addSystemGoal}
                    className="bg-brand-blue text-white px-6 py-2 font-bold rounded-lg hover:bg-blue-700 w-full"
                  >
                    Add System Goal
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {goals.map((g) => (
                  <div
                    key={g.id}
                    className={`border p-3 rounded-lg flex justify-between items-center ${g.is_system_goal ? "bg-purple-50" : "bg-white shadow-sm"}`}
                  >
                    <div>
                      <h4 className="font-bold text-sm">
                        {g.title}{" "}
                        {g.is_system_goal && (
                          <span className="text-[10px] ml-2 uppercase bg-purple-200 text-purple-700 px-1 rounded">
                            System
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-500">{g.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-mono text-sm font-bold text-brand-blue">
                        {g.current_value}/{g.target_value}{g.unit ? ` ${g.unit}` : ''}
                      </div>
                      <button
                        onClick={() => revokeGoal(g.id)}
                        className="text-xs text-red-500 hover:bg-red-100 px-2 py-1 rounded"
                      >
                        Revoke
                      </button>
                    </div>
                  </div>
                ))}
                {goals.length === 0 && (
                  <p className="text-xs text-gray-400 italic">
                    No goals assigned.
                  </p>
                )}
              </div>
            </section>

            {/* Certificates Section */}
            <section>
              <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-brand-blue" /> Certificates
              </h3>
              <div className="bg-gray-50 p-4 rounded-xl mb-4 flex gap-2">
                <select
                  value={newCertType}
                  onChange={(e) => setNewCertType(e.target.value)}
                  className="flex-1 border p-2 rounded-lg font-medium"
                >
                  {certTemplates.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <button
                  onClick={issueCert}
                  className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Issue New
                </button>
              </div>
              <div className="space-y-2">
                {certs.map((c) => (
                  <div
                    key={c.id}
                    className="border p-3 rounded-lg flex justify-between items-center bg-white shadow-sm"
                  >
                    <div>
                      <h4 className="font-bold uppercase text-sm">
                        {certTemplates.find((t) => t.id === c.certificate_type)?.name || c.certificate_type + " Certificate"}
                      </h4>
                      <div className="text-xs text-gray-500">
                        {new Date(c.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {c.status === "pending" ? (
                        <>
                          <button
                            onClick={() => updateCertStatus(c.id, "issued")}
                            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 font-bold rounded"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => revokeCert(c.id)}
                            className="text-xs px-2 py-1 bg-red-100 text-red-700 font-bold rounded hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded uppercase">
                            {c.status}
                          </span>
                          <button
                            onClick={() => revokeCert(c.id)}
                            className="text-xs px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded hover:text-red-700 transition"
                          >
                            Revoke
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {certs.length === 0 && (
                  <p className="text-xs text-gray-400 italic">
                    No certificates issued.
                  </p>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

const VolunteersManager = () => {
  const [tab, setTab] = useState<"requests" | "active" | "inactive" | "terminated" | "templates" | "content">("requests");
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [managingVolunteer, setManagingVolunteer] = useState<any>(null);
  const [pageConfig, setPageConfig] = useState<{
    rolesTitle: string;
    roles: any[];
    ctaTitle: string;
    ctaSubtitle: string;
    ctaBtn: string;
  }>({ rolesTitle: "", roles: [], ctaTitle: "", ctaSubtitle: "", ctaBtn: "" });
  const [editingRole, setEditingRole] = useState<any>(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchVolunteers = async () => {
    if (isSupabaseConfigured()) {
      const query = supabase
        .from("volunteer_applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (tab === "requests") query.eq("status", "pending");
      else if (tab === "active") query.eq("status", "approved");
      else if (tab === "inactive") query.eq("status", "inactive");
      else if (tab === "terminated") query.eq("status", "terminated");

      if (tab !== "content") {
        const { data } = await query;
        if (data) {
          const vids = data.map((v) => v.id);
          const { data: donations } = await supabase
            .from("donations")
            .select("volunteer_id, amount")
            .in("volunteer_id", vids)
            .eq("status", "success");

          const donationsMap: Record<number, number> = {};
          if (donations) {
            donations.forEach((d) => {
              if (d.volunteer_id) {
                donationsMap[d.volunteer_id] =
                  (donationsMap[d.volunteer_id] || 0) + Number(d.amount);
              }
            });
          }

          const enrichedData = data.map((v) => ({
            ...v,
            total_raised: donationsMap[v.id] || 0,
          }));
          setVolunteers(enrichedData);
        }
      }
    }
  };
  const fetchPageConfig = async () => {
    if (isSupabaseConfigured()) {
      const keys = [
        "vol_roles_title",
        "vol_roles_json",
        "vol_cta_title",
        "vol_cta_subtitle",
        "vol_cta_btn",
      ];
      const { data } = await supabase
        .from("system_settings")
        .select("*")
        .in("key", keys);
      if (data) {
        const val = (k: string) => data.find((d) => d.key === k)?.value;
        let roles = [];
        try {
          if (val("vol_roles_json")) roles = JSON.parse(val("vol_roles_json")!);
        } catch (e) {}
        setPageConfig({
          rolesTitle: val("vol_roles_title") || "",
          roles,
          ctaTitle: val("vol_cta_title") || "",
          ctaSubtitle: val("vol_cta_subtitle") || "",
          ctaBtn: val("vol_cta_btn") || "",
        });
      }
    }
  };

  useEffect(() => {
    if (tab === "content") fetchPageConfig();
    else fetchVolunteers();
  }, [tab]);

  const updateStatus = async (id: number, status: string) => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("volunteer_applications")
        .update({ status })
        .eq("id", id)
        .select();
      if (error) customAlert("Error: " + error.message);
      else if (!data || data.length === 0) customAlert("Permission denied.");
      else {
        fetchVolunteers();
        // Portal login instructions go out as a separate email from the
        // signup welcome email, and only once the application is actually
        // approved (covers both first-time approval from "requests" and
        // restoring someone from inactive/terminated back to active).
        // Best-effort: the status update above already succeeded and is
        // the part that matters, so a failure here is logged, not surfaced
        // as an error to the admin.
        if (status === "approved") {
          try {
            const { data: sessionData } = await supabase.auth.getSession();
            const token = sessionData?.session?.access_token;
            if (token) {
              await fetch("/api/admin/send-portal-invite", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ application_id: id }),
              });
            }
          } catch (e) {
            console.error("Failed to trigger portal invite email:", e);
          }
        }
      }
    }
  };
  const savePageConfig = async () => {
    setLoading(true);
    if (isSupabaseConfigured()) {
      const updates = [
        {
          key: "vol_roles_title",
          value: pageConfig.rolesTitle,
          updated_at: new Date().toISOString(),
        },
        {
          key: "vol_roles_json",
          value: JSON.stringify(pageConfig.roles),
          updated_at: new Date().toISOString(),
        },
        {
          key: "vol_cta_title",
          value: pageConfig.ctaTitle,
          updated_at: new Date().toISOString(),
        },
        {
          key: "vol_cta_subtitle",
          value: pageConfig.ctaSubtitle,
          updated_at: new Date().toISOString(),
        },
        {
          key: "vol_cta_btn",
          value: pageConfig.ctaBtn,
          updated_at: new Date().toISOString(),
        },
      ];
      const { error } = await supabase.from("system_settings").upsert(updates);
      if (error) customAlert("Error saving: " + error.message);
      else {
        fetchPageConfig();
        customAlert("Updated!");
      }
    }
    setLoading(false);
  };
  const addRole = () => {
    if (!editingRole.title) return;
    const newRoles = [...pageConfig.roles];
    if (typeof editingRole.index === "number") {
      newRoles[editingRole.index] = { ...editingRole, index: undefined };
    } else {
      newRoles.push({ ...editingRole, index: undefined });
    }
    setPageConfig({ ...pageConfig, roles: newRoles });
    setEditingRole(null);
  };
  const deleteRole = async (idx: number) => {
    if (!(await customConfirm("Remove this role?"))) return;
    const newRoles = pageConfig.roles.filter((_, i) => i !== idx);
    setPageConfig({ ...pageConfig, roles: newRoles });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-blue">
          Workforce Management
        </h2>
        {tab === "content" && (
          <button
            onClick={savePageConfig}
            disabled={loading}
            className="bg-brand-blue text-white px-6 py-2 rounded-xl font-bold shadow-sm hover:shadow-md transition"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <div className="flex items-center">
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </div>
            )}
          </button>
        )}
      </div>
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setTab("requests")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition ${tab === "requests" ? "border-brand-blue text-brand-blue" : "border-transparent text-gray-500 hover:text-brand-blue"}`}
        >
          Pending Requests
        </button>
        <button
          onClick={() => setTab("active")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition ${tab === "active" ? "border-brand-blue text-brand-blue" : "border-transparent text-gray-500 hover:text-brand-blue"}`}
        >
          Active Team
        </button>
        <button
          onClick={() => setTab("inactive")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition ${tab === "inactive" ? "border-brand-blue text-brand-blue" : "border-transparent text-gray-500 hover:text-brand-blue"}`}
        >
          Inactive
        </button>
        <button
          onClick={() => setTab("terminated")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition ${tab === "terminated" ? "border-brand-blue text-brand-blue" : "border-transparent text-gray-500 hover:text-brand-blue"}`}
        >
          Terminated
        </button>
        <button
          onClick={() => setTab("templates")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition ${tab === "templates" ? "border-brand-blue text-brand-blue" : "border-transparent text-gray-500 hover:text-brand-blue"}`}
        >
          Certificates
        </button>
        <button
          onClick={() => setTab("content")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition ${tab === "content" ? "border-brand-blue text-brand-blue" : "border-transparent text-gray-500 hover:text-brand-blue"}`}
        >
          Page Content
        </button>
      </div>
      {tab === "templates" ? (
        <CertificateTemplateManager />
      ) : tab !== "content" ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email / Phone</th>
                <th className="px-6 py-4">Type & Interest</th>
                <th className="px-6 py-4">Personalized Link</th>
                <th className="px-6 py-4">
                  {tab === "active" ? "Raised" : "Payment"}
                </th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((v) => (
                <tr
                  key={v.id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-bold">
                    {v.first_name} {v.last_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>{v.email}</div>
                    <div className="text-xs text-gray-400">{v.phone}</div>
                  </td>
                  <td className="px-6 py-4 flex flex-col gap-1 items-start">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${v.application_type === "internship" ? "bg-purple-50 text-purple-600" : "bg-green-50 text-green-600"}`}
                    >
                      {v.application_type || "volunteer"}
                    </span>
                    <span className="bg-blue-50 text-brand-blue px-2 py-1 rounded text-xs font-bold">
                      {v.interest}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-gray-400" title="Application ID">
                        #{v.id}
                      </span>
                      <button
                        onClick={() => {
                          const link = `${window.location.origin}/donate?vid=${v.id}`;
                          navigator.clipboard.writeText(link);
                          customAlert("Personalized link copied to clipboard!");
                        }}
                        title="Copy this person's auto-tracking donate link"
                        className="text-brand-blue hover:text-blue-700 flex items-center gap-1 font-bold"
                      >
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono">
                    {tab === "active"
                      ? `₹${(v.total_raised || 0).toLocaleString("en-IN")}`
                      : v.amount_paid
                        ? `₹${v.amount_paid}`
                        : "-"}
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                    {tab === "requests" && (
                      <button
                        onClick={() => updateStatus(v.id, "approved")}
                        title="Approve"
                        className="bg-green-50 text-green-600 hover:bg-green-100 p-2 rounded-lg transition"
                      >
                        <LucideIcons.Check className="w-4 h-4" />
                      </button>
                    )}
                    {tab === "active" && (
                      <>
                        <button
                          onClick={() => setManagingVolunteer(v)}
                          title="Manage Portal"
                          className="bg-blue-50 text-brand-blue hover:bg-blue-100 p-2 rounded-lg transition"
                        >
                          <LucideIcons.Settings className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateStatus(v.id, "inactive")}
                          title="Mark Inactive"
                          className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100 p-2 rounded-lg transition"
                        >
                          <LucideIcons.Pause className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateStatus(v.id, "terminated")}
                          title="Terminate"
                          className="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-lg transition"
                        >
                          <LucideIcons.Ban className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {(tab === "inactive" || tab === "terminated") && (
                      <button
                        onClick={() => updateStatus(v.id, "approved")}
                        title="Restore to Active"
                        className="bg-green-50 text-green-600 hover:bg-green-100 p-2 rounded-lg transition"
                      >
                        <LucideIcons.Check className="w-4 h-4" />
                      </button>
                    )}
                    {(tab === "requests" || tab === "inactive") && (
                      <button
                        onClick={() => updateStatus(v.id, "rejected")}
                        title={tab === "requests" ? "Reject" : "Remove completely"}
                        className="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-lg transition"
                      >
                        <LucideIcons.Trash className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {volunteers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-400 font-medium"
                  >
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in-up">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center">
              <Target className="w-5 h-5 mr-2 text-brand-blue" /> Section 1:
              Ways You Can Help
            </h3>
            <div className="mb-6">
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                Section Title
              </label>
              <input
                value={pageConfig.rolesTitle}
                onChange={(e) =>
                  setPageConfig({ ...pageConfig, rolesTitle: e.target.value })
                }
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none"
                placeholder="e.g. Ways You Can Help"
              />
            </div>
            <div className="flex justify-between items-center mb-4 border-t border-gray-100 pt-6">
              <h4 className="font-bold text-gray-600 text-sm">Role Cards</h4>
              <button
                onClick={() =>
                  setEditingRole({
                    title: "",
                    desc: "",
                    icon: "Heart",
                    type: "volunteer",
                    fullDescription: "",
                  })
                }
                className="text-sm font-bold text-brand-blue flex items-center bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Role
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {pageConfig.roles.map((role, idx) => (
                <div
                  key={idx}
                  className="border border-gray-100 p-4 rounded-xl flex items-start gap-4 hover:shadow-md transition bg-gray-50"
                >
                  <div className="p-3 bg-white rounded-lg shadow-sm text-brand-blue">
                    {/* @ts-ignore */}
                    {React.createElement(
                      LucideIcons[role.icon] || LucideIcons.CircleHelp,
                      { className: "w-6 h-6" },
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-800">{role.title}</h4>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${role.type === "internship" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"}`}
                      >
                        {role.type || "volunteer"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {role.desc}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setEditingRole({ ...role, index: idx })}
                      className="text-blue-500 hover:bg-blue-100 p-1.5 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteRole(idx)}
                      className="text-red-500 hover:bg-red-100 p-1.5 rounded"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-brand-blue" /> Section 2:
              Call to Action
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                  CTA Title
                </label>
                <input
                  value={pageConfig.ctaTitle}
                  onChange={(e) =>
                    setPageConfig({ ...pageConfig, ctaTitle: e.target.value })
                  }
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none"
                  placeholder="e.g., Ready to Make a Difference?"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                  CTA Subtitle
                </label>
                <textarea
                  value={pageConfig.ctaSubtitle}
                  onChange={(e) =>
                    setPageConfig({
                      ...pageConfig,
                      ctaSubtitle: e.target.value,
                    })
                  }
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none h-20"
                  placeholder="e.g., Join our community of volunteers today."
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                  Button Label
                </label>
                <input
                  value={pageConfig.ctaBtn}
                  onChange={(e) =>
                    setPageConfig({ ...pageConfig, ctaBtn: e.target.value })
                  }
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none"
                  placeholder="e.g., Apply Now"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal
        isOpen={!!editingRole}
        onClose={() => {
          setEditingRole(null);
          setShowIconPicker(false);
        }}
        title={editingRole?.index !== undefined ? "Edit Role" : "Add Role"}
      >
        {editingRole && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Role Title
              </label>
              <input
                value={editingRole.title}
                onChange={(e) =>
                  setEditingRole({ ...editingRole, title: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Role Type
              </label>
              <select
                value={editingRole.type || "volunteer"}
                onChange={(e) =>
                  setEditingRole({ ...editingRole, type: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              >
                <option value="volunteer">Volunteer</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Short Description
              </label>
              <textarea
                value={editingRole.desc}
                onChange={(e) =>
                  setEditingRole({ ...editingRole, desc: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Full Description (Expectations)
              </label>
              <textarea
                value={editingRole.fullDescription || ""}
                onChange={(e) =>
                  setEditingRole({
                    ...editingRole,
                    fullDescription: e.target.value,
                  })
                }
                className="w-full border p-2 rounded-lg"
                rows={4}
                placeholder="Detailed expectations and requirements..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Icon
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowIconPicker(!showIconPicker)}
                  className="flex items-center justify-between w-full border p-2 rounded-lg bg-white text-left"
                >
                  <span className="flex items-center">
                    {/* @ts-ignore */}
                    {React.createElement(
                      LucideIcons[editingRole.icon] || LucideIcons.CircleHelp,
                      { className: "w-4 h-4 mr-2" },
                    )}
                    {editingRole.icon}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${showIconPicker ? "rotate-90" : ""}`}
                  />
                </button>
                {showIconPicker && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-xl shadow-xl z-50 p-2 grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
                    {VALID_ICONS.map((iconName) => (
                      <button
                        key={iconName}
                        onClick={() => {
                          setEditingRole({ ...editingRole, icon: iconName });
                          setShowIconPicker(false);
                        }}
                        className={`p-2 rounded-lg hover:bg-gray-100 flex justify-center ${editingRole.icon === iconName ? "bg-blue-50 text-blue-600" : "text-gray-600"}`}
                        title={iconName}
                      >
                        {/* @ts-ignore */}
                        {React.createElement(
                          LucideIcons[iconName] || LucideIcons.CircleHelp,
                          { className: "w-5 h-5" },
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={addRole}
              className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold mt-4"
            >
              Confirm Role
            </button>
          </div>
        )}
      </Modal>
      {managingVolunteer && (
        <VolunteerPortalManager
          volunteer={managingVolunteer}
          onClose={() => setManagingVolunteer(null)}
        />
      )}
    </div>
  );
};

const ChecklistManager = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState<"volunteer" | "internship">(
    "internship",
  );
  const [localItems, setLocalItems] = useState<any[]>([]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    const template = templates.find(
      (t) => t.role === editingRole && t.day === 1,
    );
    setLocalItems(template ? [...template.items] : []);
  }, [templates, editingRole]);

  const fetchTemplates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("checklist_templates")
      .select("*")
      .order("role");
    if (data) setTemplates(data);
    setLoading(false);
  };

  const handleSave = async () => {
    const template = templates.find(
      (t) => t.role === editingRole && t.day === 1,
    );
    if (template) {
      const { error } = await supabase
        .from("checklist_templates")
        .update({ items: localItems })
        .eq("id", template.id);
      if (error) customAlert("Error saving: " + error.message);
      else {
        customAlert("Saved successfully!");
        fetchTemplates();
      }
    } else {
      const { error } = await supabase
        .from("checklist_templates")
        .insert({ role: editingRole, day: 1, items: localItems });
      if (error) customAlert("Error saving: " + error.message);
      else {
        customAlert("Saved successfully!");
        fetchTemplates();
      }
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-blue" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setEditingRole("internship")}
          className={`px-6 py-3 rounded-xl font-bold ${editingRole === "internship" ? "bg-brand-blue text-white" : "bg-white text-gray-600 border"}`}
        >
          Internship Checklist
        </button>
        <button
          onClick={() => setEditingRole("volunteer")}
          className={`px-6 py-3 rounded-xl font-bold ${editingRole === "volunteer" ? "bg-brand-blue text-white" : "bg-white text-gray-600 border"}`}
        >
          Volunteer Checklist
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-brand-blue capitalize">
            Day 1 {editingRole} Checklist
          </h2>
          <button
            onClick={() => {
              setLocalItems([
                ...localItems,
                {
                  id: Math.random().toString(),
                  text: "New Task",
                  icon: "Check",
                },
              ]);
            }}
            className="flex items-center text-sm font-bold text-brand-blue bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Task
          </button>
        </div>

        <div className="space-y-4">
          {localItems.map((item: any, index: number) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 border rounded-xl bg-gray-50"
            >
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  Task Text
                </label>
                <input
                  value={item.text}
                  onChange={(e) => {
                    const newItems = [...localItems];
                    newItems[index].text = e.target.value;
                    setLocalItems(newItems);
                  }}
                  className="w-full border p-2 rounded-lg text-sm"
                />
              </div>
              <div className="w-48">
                <label className="block text-xs font-bold text-gray-500 mb-1">
                  Icon Name
                </label>
                <select
                  value={item.icon}
                  onChange={(e) => {
                    const newItems = [...localItems];
                    newItems[index].icon = e.target.value;
                    setLocalItems(newItems);
                  }}
                  className="w-full border p-2 rounded-lg text-sm"
                >
                  {VALID_ICONS.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => {
                  const newItems = localItems.filter(
                    (_: any, i: number) => i !== index,
                  );
                  setLocalItems(newItems);
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-5"
              >
                <Trash className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-brand-blue text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const PartnersManager = () => {
  const [tab, setTab] = useState<"inquiries" | "active" | "archived">("inquiries");
  const [partners, setPartners] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ organization: "", logo_url: "", message: "", contact_name: "", email: "", phone: "" });

  const fetch = async () => {
    if (isSupabaseConfigured()) {
      const query = supabase
        .from("partnership_inquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (tab === "inquiries") query.in("status", ["new", "contacted"]);
      else query.eq("status", tab === "active" ? "active" : "archived");
      const { data } = await query;
      if (data) setPartners(data);
    }
  };

  useEffect(() => {
    fetch();
  }, [tab]);

  const updateStatus = async (id: number, status: string) => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from("partnership_inquiries")
        .update({ status })
        .eq("id", id)
        .select();
      if (error) customAlert("Error: " + error.message);
      else if (!data || data.length === 0) customAlert("Permission denied.");
      else {
        if (
          (tab === "inquiries" && status === "active") ||
          (tab === "active" && status === "archived")
        ) {
          setPartners((prev) => prev.filter((p) => p.id !== id));
        } else {
          setPartners((prev) =>
            prev.map((p) => (p.id === id ? { ...p, status } : p)),
          );
        }
      }
    }
  };

  const savePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) return;
    
    const payload = {
        organization: form.organization,
        logo_url: form.logo_url,
        message: form.message,
        contact_name: form.contact_name,
        email: form.email,
        phone: form.phone,
        status: 'active',
        inquiry_type: 'Manual Addition'
    };

    if (editingId) {
        const { error } = await supabase.from('partnership_inquiries').update({ organization: form.organization, logo_url: form.logo_url, message: form.message }).eq('id', editingId);
        if (error) customAlert(error.message);
        else {
            setShowAddForm(false);
            setEditingId(null);
            setForm({ organization: "", logo_url: "", message: "", contact_name: "", email: "", phone: "" });
            fetch();
        }
    } else {
        const { error } = await supabase.from('partnership_inquiries').insert(payload);
        if (error) customAlert(error.message);
        else {
            setShowAddForm(false);
            setForm({ organization: "", logo_url: "", message: "", contact_name: "", email: "", phone: "" });
            if (tab === 'active') fetch();
            else setTab('active');
        }
    }
  };

  const startEdit = (p: any) => {
      setEditingId(p.id);
      setForm({
          organization: p.organization || "",
          logo_url: p.logo_url || "",
          message: p.message || "",
          contact_name: p.contact_name || "",
          email: p.email || "",
          phone: p.phone || ""
      });
      setShowAddForm(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-brand-blue">
            Partnership Management
          </h2>
          <button onClick={() => {
              setEditingId(null);
              setForm({ organization: "", logo_url: "", message: "", contact_name: "", email: "", phone: "" });
              setShowAddForm(true);
          }} className="bg-brand-blue text-white px-4 py-2 rounded-xl text-sm font-bold shadow-skeuo-raised hover:-translate-y-0.5 transition flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Partner Manually
          </button>
      </div>
      
      {showAddForm && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">{editingId ? 'Edit Partner Details' : 'Add New Partner'}</h3>
                  <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={savePartner} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Organization Name</label>
                          <input required type="text" value={form.organization} onChange={e => setForm({...form, organization: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-brand-blue" />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Logo (Optional)</label>
                          <ImageUpload value={form.logo_url || ""} onChange={(url) => setForm({...form, logo_url: url})} />
                      </div>
                  </div>
                  {!editingId && (
                      <div className="grid grid-cols-3 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contact Name</label>
                              <input type="text" value={form.contact_name} onChange={e => setForm({...form, contact_name: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-brand-blue" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-brand-blue" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                              <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-brand-blue" />
                          </div>
                      </div>
                  )}
                  <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description / Message</label>
                      <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={3} className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-brand-blue resize-none"></textarea>
                  </div>
                  <button type="submit" className="bg-brand-blue text-white px-6 py-2 rounded-lg font-bold">Save Partner</button>
              </form>
          </div>
      )}

      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setTab("inquiries")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition ${tab === "inquiries" ? "border-brand-blue text-brand-blue" : "border-transparent text-gray-500 hover:text-brand-blue"}`}
        >
          New Inquiries
        </button>
        <button
          onClick={() => setTab("active")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition ${tab === "active" ? "border-brand-blue text-brand-blue" : "border-transparent text-gray-500 hover:text-brand-blue"}`}
        >
          Active Partners
        </button>
        <button
          onClick={() => setTab("archived")}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition ${tab === "archived" ? "border-brand-blue text-brand-blue" : "border-transparent text-gray-500 hover:text-brand-blue"}`}
        >
          Archived
        </button>
      </div>
      <div className="grid gap-4">
        {partners.map((p) => (
          <div
            key={p.id}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start gap-4 transition hover:shadow-md"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {p.logo_url && <img src={p.logo_url} alt={p.organization} className="w-8 h-8 rounded-full object-cover border border-gray-200" />}
                <h3 className="font-bold text-lg text-gray-800">
                  {p.organization}
                </h3>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${p.status === "new" ? "bg-blue-100 text-blue-700" : p.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                >
                  {p.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2 font-medium">
                Contact: {p.contact_name}{" "}
                <span className="text-gray-300">|</span> {p.email}{" "}
                <span className="text-gray-300">|</span> {p.phone}
              </p>
              <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 max-w-3xl">
                <span className="block text-xs font-bold text-gray-400 uppercase mb-1">
                  {p.inquiry_type}
                </span>
                {p.message}
              </div>
            </div>
            <div className="flex flex-col gap-2 min-w-[140px]">
              {tab === "inquiries" && (
                <>
                  {p.status === "new" && (
                    <button
                      onClick={() => updateStatus(p.id, "contacted")}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-xs font-bold transition"
                    >
                      Mark Contacted
                    </button>
                  )}
                  <button
                    onClick={() => updateStatus(p.id, "active")}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm"
                  >
                    Onboard Partner
                  </button>
                </>
              )}
              {tab === "active" && (
                <>
                  <button
                    onClick={() => startEdit(p)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => updateStatus(p.id, "archived")}
                    className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-xs font-bold transition"
                  >
                    Archive Partner
                  </button>
                </>
              )}
              {tab === "archived" && (
                <button
                  onClick={() => updateStatus(p.id, "active")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-xs font-bold transition"
                >
                  Restore
                </button>
              )}
            </div>
          </div>
        ))}
        {partners.length === 0 && (
          <p className="text-center text-gray-400 py-12 font-medium">
            No records found.
          </p>
        )}
      </div>
    </div>
  );
};
const NewsletterManager = () => {
  const [subs, setSubs] = useState<any[]>([]);
  useEffect(() => {
    if (isSupabaseConfigured())
      supabase
        .from("newsletter_subscribers")
        .select("*")
        .then(({ data }) => {
          if (data) setSubs(data);
        });
  }, []);
  const downloadCSV = () => {
    const csv =
      "Email,Subscribed At\n" +
      subs.map((s) => `${s.email},${s.subscribed_at}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
  };
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-blue">
          Newsletter Subscribers
        </h2>
        <button
          onClick={downloadCSV}
          className="bg-brand-green text-white px-4 py-2 rounded-lg font-bold flex items-center"
        >
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </button>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <p className="font-bold text-gray-700 mb-4">
          Total Subscribers: {subs.length}
        </p>
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-left">
            <tbody>
              {subs.map((s) => (
                <tr
                  key={s.id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm text-gray-600">{s.email}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 text-right">
                    {new Date(s.subscribed_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ImpactManager = ({
  userRole,
  userEmail,
  userId,
}: {
  userRole: AdminRole | null;
  userEmail: string | undefined;
  userId: string | undefined;
}) => {
  const [tab, setTab] = useState<"stats" | "stories">("stats");
  const [stats, setStats] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [editingStat, setEditingStat] = useState<any>(null);
  const [editingStory, setEditingStory] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    if (isSupabaseConfigured()) {
      let stQuery = supabase.from("impact_stats").select("*").neq("is_deleted", true).order("id");
      if (userRole === "content_creator")
        stQuery = stQuery.eq("author_id", userId);
      const { data: st } = await stQuery;
      let stoQuery = supabase
        .from("impact_stories")
        .select("*")
        .neq("is_deleted", true)
        .order("created_at", { ascending: false });
      if (userRole === "content_creator")
        stoQuery = stoQuery.eq("author_id", userId);
      const { data: sto } = await stoQuery;
      if (st) setStats(st);
      if (sto) setStories(sto);
    } else {
      setStats([]);
      setStories([]);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const saveStat = async (status: string) => {
    if (!isSupabaseConfigured() || !editingStat) return;
    setLoading(true);
    const { id, display_order, ...updateData } = editingStat;
    updateData.approval_status = status;
    updateData.author_email = updateData.author_email || userEmail;
    updateData.author_id = updateData.author_id || userId;
    const query = id
      ? supabase.from("impact_stats").update(updateData).eq("id", id)
      : supabase.from("impact_stats").insert(updateData);
    const { data, error } = await query.select();
    setLoading(false);
    if (error) customAlert("Error saving: " + error.message);
    else if (!data || data.length === 0) customAlert("Permission denied.");
    else {
      setEditingStat(null);
      fetchData();
    }
  };
  const deleteStat = async (id: number) => {
    if (!(await customConfirm("Delete?"))) return;
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from("impact_stats")
        .update({ is_deleted: true })
        .eq("id", id);
      if (error) customAlert("Error deleting: " + error.message);
      else fetchData();
    }
  };
  const saveStory = async (status: string) => {
    if (!isSupabaseConfigured() || !editingStory) return;
    setLoading(true);
    const { id, ...updateData } = editingStory;
    updateData.approval_status = status;
    updateData.author_email = updateData.author_email || userEmail;
    updateData.author_id = updateData.author_id || userId;
    const query = id
      ? supabase.from("impact_stories").update(updateData).eq("id", id)
      : supabase.from("impact_stories").insert(updateData);
    const { data, error } = await query.select();
    setLoading(false);
    if (error) customAlert("Error saving: " + error.message);
    else if (!data || data.length === 0) customAlert("Permission denied.");
    else {
      setEditingStory(null);
      fetchData();
    }
  };
  const deleteStory = async (id: number) => {
    if (!(await customConfirm("Delete?"))) return;
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from("impact_stories")
        .update({ is_deleted: true })
        .eq("id", id);
      if (error) customAlert("Error deleting: " + error.message);
      else fetchData();
    }
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex space-x-2 border-b border-gray-200 overflow-x-auto pb-1 mb-6">
        <button
          onClick={() => setTab("stats")}
          className={`px-4 py-2 text-sm font-bold rounded-t-lg transition whitespace-nowrap ${tab === "stats" ? "bg-white border-t border-x border-gray-200 text-brand-blue" : "text-gray-500 hover:bg-gray-50"}`}
        >
          Statistics
        </button>
        <button
          onClick={() => setTab("stories")}
          className={`px-4 py-2 text-sm font-bold rounded-t-lg transition whitespace-nowrap ${tab === "stories" ? "bg-white border-t border-x border-gray-200 text-brand-blue" : "text-gray-500 hover:bg-gray-50"}`}
        >
          Success Stories
        </button>
      </div>
      {tab === "stats" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-brand-blue">
              Key Statistics
            </h2>
            <button
              onClick={() =>
                setEditingStat({
                  label: "",
                  value: "",
                  description: "",
                  approval_status:
                    userRole === "content_creator" ? "draft" : "published",
                })
              }
              className="text-brand-blue text-sm font-bold flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Stat
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map((s: any) => (
              <div
                key={s.id}
                className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition relative group"
              >
                <h3 className="font-bold text-2xl text-brand-blue flex items-center gap-2">
                  {s.value}{" "}
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded uppercase ${s.approval_status === "published" ? "bg-green-100 text-green-700" : s.approval_status === "pending" ? "bg-yellow-100 text-yellow-700" : s.approval_status === "rejected" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}
                  >
                    {s.approval_status || "published"}
                  </span>
                </h3>
                <p className="font-bold text-gray-800 text-sm">{s.label}</p>
                <p className="text-xs text-gray-500">{s.description}</p>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1">
                  <button
                    onClick={() => setEditingStat(s)}
                    className="p-1 bg-gray-100 rounded text-blue-600"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => deleteStat(s.id)}
                    className="p-1 bg-gray-100 rounded text-red-600"
                  >
                    <Trash className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "stories" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-brand-blue">
              Impact Stories
            </h2>
            <button
              onClick={() =>
                setEditingStory({
                  title: "",
                  description: "",
                  author: "",
                  location: "",
                  image_url: "",
                  approval_status:
                    userRole === "content_creator" ? "draft" : "published",
                })
              }
              className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Story
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((s: any) => (
              <div
                key={s.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group"
              >
                <img
                  src={s.image_url}
                  alt={s.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                    {s.title}{" "}
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded uppercase ${s.approval_status === "published" ? "bg-green-100 text-green-700" : s.approval_status === "pending" ? "bg-yellow-100 text-yellow-700" : s.approval_status === "rejected" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}
                    >
                      {s.approval_status || "published"}
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {s.author} • {s.location}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {s.description}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingStory(s)}
                      className="flex-1 bg-gray-50 text-blue-600 py-1 rounded text-xs font-bold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteStory(s.id)}
                      className="flex-1 bg-red-50 text-red-600 py-1 rounded text-xs font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Modal
        isOpen={!!editingStat}
        onClose={() => setEditingStat(null)}
        title="Edit Statistic"
      >
        {editingStat && (
          <div className="space-y-4">
            <input
              placeholder="Value (e.g. 50k+)"
              value={editingStat.value}
              onChange={(e) =>
                setEditingStat({ ...editingStat, value: e.target.value })
              }
              className="w-full border p-2 rounded-lg"
            />
            <input
              placeholder="Label (e.g. Lives Touched)"
              value={editingStat.label}
              onChange={(e) =>
                setEditingStat({ ...editingStat, label: e.target.value })
              }
              className="w-full border p-2 rounded-lg"
            />
            <input
              placeholder="Description"
              value={editingStat.description}
              onChange={(e) =>
                setEditingStat({ ...editingStat, description: e.target.value })
              }
              className="w-full border p-2 rounded-lg"
            />
            <ApprovalControls
              item={editingStat}
              setItem={setEditingStat}
              onSave={saveStat}
              loading={loading}
              userRole={userRole}
              userEmail={userEmail}
            />
          </div>
        )}
      </Modal>
      <Modal
        isOpen={!!editingStory}
        onClose={() => setEditingStory(null)}
        title="Edit Story"
      >
        {editingStory && (
          <div className="space-y-4">
            <input
              placeholder="Title"
              value={editingStory.title}
              onChange={(e) =>
                setEditingStory({ ...editingStory, title: e.target.value })
              }
              className="w-full border p-2 rounded-lg"
            />
            <textarea
              placeholder="Description"
              value={editingStory.description}
              onChange={(e) =>
                setEditingStory({
                  ...editingStory,
                  description: e.target.value,
                })
              }
              className="w-full border p-2 rounded-lg"
              rows={4}
            />
            <input
              type="date"
              placeholder="Date"
              title="Date"
              value={editingStory.created_at ? new Date(editingStory.created_at).toISOString().split('T')[0] : ''}
              onChange={(e) =>
                setEditingStory({ ...editingStory, created_at: new Date(e.target.value).toISOString() })
              }
              className="w-full border p-2 rounded-lg"
            />
            <input
              placeholder="Author"
              value={editingStory.author}
              onChange={(e) =>
                setEditingStory({ ...editingStory, author: e.target.value })
              }
              className="w-full border p-2 rounded-lg"
            />
            <input
              placeholder="Location"
              value={editingStory.location}
              onChange={(e) =>
                setEditingStory({ ...editingStory, location: e.target.value })
              }
              className="w-full border p-2 rounded-lg"
            />
            <ImageUpload
              value={editingStory.image_url}
              onChange={(url) =>
                setEditingStory({ ...editingStory, image_url: url })
              }
            />
            <ApprovalControls
              item={editingStory}
              setItem={setEditingStory}
              onSave={saveStory}
              loading={loading}
              userRole={userRole}
              userEmail={userEmail}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

const ApprovalControls = ({
  item,
  setItem,
  onSave,
  loading,
  userRole,
  userEmail,
}: any) => {
  const isCreator = userRole === "content_creator";
  const isManager =
    userRole === "content_manager" || userRole === "super_admin";
  const status = item.approval_status || "published";

  return (
    <div className="border-t border-gray-100 pt-4 mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 uppercase">
          Status:
          <span
            className={`ml-2 px-2 py-1 rounded ${status === "published" ? "bg-green-100 text-green-700" : status === "pending" ? "bg-yellow-100 text-yellow-700" : status === "rejected" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}
          >
            {status.toUpperCase()}
          </span>
        </span>
      </div>
      {status === "rejected" && item.reviewer_comments && (
        <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-sm text-red-800">
          <strong>Reviewer Comments:</strong> {item.reviewer_comments}
        </div>
      )}
      {isManager && status === "pending" && (
        <div>
          <textarea
            placeholder="Leave a comment for the creator (if rejecting)..."
            value={item.reviewer_comments || ""}
            onChange={(e) =>
              setItem({ ...item, reviewer_comments: e.target.value })
            }
            className="w-full border p-2 rounded-lg text-sm mb-2"
            rows={2}
          />
        </div>
      )}
      <div className="flex gap-2">
        {isCreator && (
          <>
            <button
              onClick={() => onSave("draft")}
              disabled={loading}
              className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-200"
            >
              Save Draft
            </button>
            <button
              onClick={() => onSave("pending")}
              disabled={loading}
              className="flex-1 bg-brand-blue text-white py-2 rounded-lg font-bold hover:bg-blue-700"
            >
              Submit for Review
            </button>
          </>
        )}
        {isManager && (
          <>
            {status === "pending" && (
              <button
                onClick={() => onSave("rejected")}
                disabled={loading}
                className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg font-bold hover:bg-red-200"
              >
                Request Changes
              </button>
            )}
            <button
              onClick={() => onSave("published")}
              disabled={loading}
              className="flex-1 bg-green-500 text-white py-2 rounded-lg font-bold hover:bg-green-600"
            >
              {status === "pending" ? "Approve & Publish" : "Publish Directly"}
            </button>
            {status !== "draft" && status !== "pending" && (
              <button
                onClick={() => onSave("draft")}
                disabled={loading}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-200"
              >
                Unpublish (Draft)
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const BlogManager = ({
  userRole,
  userEmail,
  userId,
}: {
  userRole: AdminRole | null;
  userEmail: string | undefined;
  userId: string | undefined;
}) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fetchPosts = async () => {
    if (isSupabaseConfigured()) {
      let query = supabase
        .from("blog_posts")
        .select("*")
        .neq("is_deleted", true)
        .order("created_at", { ascending: false });
      if (userRole === "content_creator") query = query.eq("author_id", userId);
      const { data } = await query;
      if (data) setPosts(data);
    } else setPosts([]);
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  const savePost = async (status: string) => {
    if (isSupabaseConfigured() && editingPost) {
      setLoading(true);
      const { id, ...updateData } = editingPost;
      updateData.approval_status = status;
      updateData.author_email = updateData.author_email || userEmail;
      updateData.author_id = updateData.author_id || userId;
      const query = id
        ? supabase.from("blog_posts").update(updateData).eq("id", id)
        : supabase.from("blog_posts").insert(updateData);
      const { data, error } = await query.select();
      setLoading(false);
      if (error) customAlert("Error: " + error.message);
      else if (!data || data.length === 0) customAlert("Permission denied.");
      else {
        setEditingPost(null);
        fetchPosts();
      }
    }
  };
  const deletePost = async (id: number) => {
    if (await customConfirm("Delete post?")) {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from("blog_posts")
          .update({ is_deleted: true })
          .eq("id", id);
        if (error) customAlert("Error deleting: " + error.message);
        else fetchPosts();
      }
    }
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-blue">Blog Posts</h2>
        <button
          onClick={() =>
            setEditingPost({
              title: "",
              excerpt: "",
              content: "",
              author: "Admin",
              category: "General",
              approval_status:
                userRole === "content_creator" ? "draft" : "published",
            })
          }
          className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> New Post
        </button>
      </div>
      <div className="grid gap-4">
        {posts.map((p) => (
          <div
            key={p.id}
            className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                {p.title}{" "}
                <span
                  className={`text-[10px] px-2 py-0.5 rounded uppercase ${p.approval_status === "published" ? "bg-green-100 text-green-700" : p.approval_status === "pending" ? "bg-yellow-100 text-yellow-700" : p.approval_status === "rejected" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}
                >
                  {p.approval_status || "published"}
                </span>
              </h3>
              <p className="text-xs text-gray-500">
                {p.author} •{" "}
                {new Date(p.created_at || Date.now()).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingPost(p)}
                className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <Edit className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => deletePost(p.id)}
                className="p-2 bg-red-50 rounded-lg hover:bg-red-100"
              >
                <Trash className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Modal
        isOpen={!!editingPost}
        onClose={() => setEditingPost(null)}
        title="Edit Blog Post"
      >
        {editingPost && (
          <div className="space-y-4">
            <input
              placeholder="Title"
              value={editingPost.title}
              onChange={(e) =>
                setEditingPost({ ...editingPost, title: e.target.value })
              }
              className="w-full border p-2 rounded-lg"
            />
            <textarea
              placeholder="Excerpt"
              value={editingPost.excerpt}
              onChange={(e) =>
                setEditingPost({ ...editingPost, excerpt: e.target.value })
              }
              className="w-full border p-2 rounded-lg"
              rows={2}
            />
            <textarea
              placeholder="Content (HTML)"
              value={editingPost.content}
              onChange={(e) =>
                setEditingPost({ ...editingPost, content: e.target.value })
              }
              className="w-full border p-2 rounded-lg font-mono text-sm"
              rows={8}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                placeholder="Date"
                title="Date"
                value={editingPost.created_at ? new Date(editingPost.created_at).toISOString().split('T')[0] : ''}
                onChange={(e) =>
                  setEditingPost({ ...editingPost, created_at: new Date(e.target.value).toISOString() })
                }
                className="w-full border p-2 rounded-lg"
              />
              <input
                placeholder="Author"
                value={editingPost.author}
                onChange={(e) =>
                  setEditingPost({ ...editingPost, author: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              />
              <input
                placeholder="Category"
                value={editingPost.category}
                onChange={(e) =>
                  setEditingPost({ ...editingPost, category: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              />
            </div>
            <ImageUpload
              value={editingPost.image_url}
              onChange={(url) =>
                setEditingPost({ ...editingPost, image_url: url })
              }
            />
            <ApprovalControls
              item={editingPost}
              setItem={setEditingPost}
              onSave={savePost}
              loading={loading}
              userRole={userRole}
              userEmail={userEmail}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

const GalleryManager = ({
  userRole,
  userEmail,
  userId,
}: {
  userRole: AdminRole | null;
  userEmail: string | undefined;
  userId: string | undefined;
}) => {
  const [view, setView] = useState<"albums" | "images">("albums");
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const [albums, setAlbums] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [editingAlbum, setEditingAlbum] = useState<any>(null);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const fetchAlbums = async () => {
    if (isSupabaseConfigured()) {
      let query = supabase.from("gallery_albums").select("*").neq("is_deleted", true);
      if (userRole === "content_creator") query = query.eq("author_id", userId);
      const { data } = await query;
      if (data) setAlbums(data);
    } else setAlbums([]);
  };
  const fetchImages = async (albumId: string) => {
    if (isSupabaseConfigured()) {
      const { data } = await supabase
        .from("gallery_images")
        .select("*")
        .neq("is_deleted", true)
        .eq("album_id", albumId);
      if (data) setImages(data);
    }
  };
  useEffect(() => {
    fetchAlbums();
  }, []);
  const openAlbum = (album: any) => {
    setSelectedAlbum(album);
    fetchImages(album.id);
    setView("images");
  };
  const saveAlbum = async (status: string) => {
    if (isSupabaseConfigured() && editingAlbum) {
      setLoading(true);
      const updateData = {
        ...editingAlbum,
        approval_status: status,
        author_email: editingAlbum.author_email || userEmail,
        author_id: editingAlbum.author_id || userId,
      };
      const { data, error } = await supabase
        .from("gallery_albums")
        .upsert(updateData)
        .select();
      setLoading(false);
      if (error) customAlert("Error: " + error.message);
      else if (!data || data.length === 0) customAlert("Permission denied.");
      else {
        setEditingAlbum(null);
        fetchAlbums();
      }
    }
  };
  const deleteAlbum = async (id: string) => {
    if (await customConfirm("Delete album?")) {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from("gallery_albums")
          .update({ is_deleted: true })
          .eq("id", id);
        if (error) customAlert("Error: " + error.message);
        else fetchAlbums();
      }
    }
  };
  const addImage = async () => {
    if (isSupabaseConfigured() && newImageUrl && selectedAlbum) {
      setLoading(true);
      const { data, error } = await supabase
        .from("gallery_images")
        .insert({ album_id: selectedAlbum.id, image_url: newImageUrl })
        .select();
      setLoading(false);
      if (error) customAlert("Error: " + error.message);
      else if (!data || data.length === 0) customAlert("Permission denied.");
      else {
        setNewImageUrl("");
        fetchImages(selectedAlbum.id);
      }
    }
  };
  const deleteImage = async (id: number) => {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from("gallery_images")
        .update({ is_deleted: true })
        .eq("id", id);
      if (error) customAlert("Error: " + error.message);
      else fetchImages(selectedAlbum.id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {view === "albums" ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-brand-blue">
              Gallery Albums
            </h2>
            <button
              onClick={() =>
                setEditingAlbum({
                  id: "",
                  title: "",
                  cover_url: "",
                  approval_status:
                    userRole === "content_creator" ? "draft" : "published",
                })
              }
              className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" /> New Album
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {albums.map((a: any) => (
              <div
                key={a.id}
                className="bg-white p-4 rounded-xl border border-gray-100 relative group"
              >
                <div onClick={() => openAlbum(a)} className="cursor-pointer">
                  <img
                    src={a.cover_url || a.cover}
                    alt={a.title}
                    className="w-full h-32 object-cover rounded-lg mb-2 bg-gray-100"
                  />
                  <h3 className="font-bold text-sm truncate flex items-center gap-2">
                    {a.title}{" "}
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded uppercase ${a.approval_status === "published" ? "bg-green-100 text-green-700" : a.approval_status === "pending" ? "bg-yellow-100 text-yellow-700" : a.approval_status === "rejected" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}
                    >
                      {a.approval_status || "published"}
                    </span>
                  </h3>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1">
                  <button
                    onClick={() => setEditingAlbum(a)}
                    className="p-1 bg-white rounded shadow text-blue-600"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => deleteAlbum(a.id)}
                    className="p-1 bg-white rounded shadow text-red-600"
                  >
                    <Trash className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Modal
            isOpen={!!editingAlbum}
            onClose={() => setEditingAlbum(null)}
            title={editingAlbum?.title ? "Edit Album" : "New Album"}
          >
            {editingAlbum && (
              <div className="space-y-4">
                <input
                  placeholder="Album ID (slug)"
                  value={editingAlbum.id}
                  onChange={(e) =>
                    setEditingAlbum({ ...editingAlbum, id: e.target.value })
                  }
                  className="w-full border p-2 rounded-lg"
                  disabled={
                    !!albums.find(
                      (a) => a.id === editingAlbum.id && a.title !== "",
                    )
                  }
                />
                <input
                  placeholder="Title"
                  value={editingAlbum.title}
                  onChange={(e) =>
                    setEditingAlbum({ ...editingAlbum, title: e.target.value })
                  }
                  className="w-full border p-2 rounded-lg"
                />
                <ImageUpload
                  value={editingAlbum.cover_url}
                  onChange={(url) =>
                    setEditingAlbum({ ...editingAlbum, cover_url: url })
                  }
                />
                <ApprovalControls
                  item={editingAlbum}
                  setItem={setEditingAlbum}
                  onSave={saveAlbum}
                  loading={loading}
                  userRole={userRole}
                  userEmail={userEmail}
                />
              </div>
            )}
          </Modal>
        </>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => {
                setSelectedAlbum(null);
                setView("albums");
              }}
              className="p-2 bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-brand-blue">
              {selectedAlbum.title} Images
            </h2>
          </div>
          <div className="flex flex-col md:flex-row gap-2 mb-6">
            <div className="flex-1">
              <ImageUpload
                value={newImageUrl}
                onChange={(url) => setNewImageUrl(url)}
              />
            </div>
            <button
              onClick={addImage}
              disabled={loading}
              className="bg-brand-green text-white px-4 py-2 rounded-lg font-bold h-fit mt-auto"
            >
              {loading ? "Adding..." : "Add Image"}
            </button>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {images.map((img: any) => (
              <div key={img.id} className="relative group">
                <img
                  src={img.image_url}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  onClick={() => deleteImage(img.id)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const TeamManager = ({
  userRole,
  userEmail,
  userId,
}: {
  userRole: AdminRole | null;
  userEmail: string | undefined;
  userId: string | undefined;
}) => {
  const [members, setMembers] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fetchTeam = async () => {
    if (isSupabaseConfigured()) {
      let query = supabase
        .from("team_members")
        .select("*")
        .neq("is_deleted", true)
        .order("display_order");
      if (userRole === "content_creator") query = query.eq("author_id", userId);
      const { data } = await query;
      if (data) setMembers(data);
    } else setMembers([]);
  };
  useEffect(() => {
    fetchTeam();
  }, []);
  const saveMember = async (status: string) => {
    if (isSupabaseConfigured() && editing) {
      setLoading(true);
      const { id, display_order, ...updateData } = editing;
      updateData.approval_status = status;
      updateData.author_email = updateData.author_email || userEmail;
      updateData.author_id = updateData.author_id || userId;

      // For new members, we need to provide a display_order if it's not set by default in DB
      const finalData = id
        ? updateData
        : { ...updateData, display_order: members.length + 1 };

      const query = id
        ? supabase.from("team_members").update(finalData).eq("id", id)
        : supabase.from("team_members").insert(finalData);
      const { data, error } = await query.select();
      setLoading(false);

      if (error) customAlert("Error: " + error.message);
      else if (!data || data.length === 0) customAlert("Permission denied.");
      else {
        setEditing(null);
        fetchTeam();
      }
    }
  };
  const deleteMember = async (id: number) => {
    if (await customConfirm("Delete member?")) {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from("team_members")
          .update({ is_deleted: true })
          .eq("id", id);
        if (error) customAlert("Error deleting: " + error.message);
        else fetchTeam();
      }
    }
  };
  const moveMember = async (index: number, direction: "up" | "down") => {
    if (!isSupabaseConfigured()) return;
    const newMembers = [...members];
    if (direction === "up" && index > 0) {
      [newMembers[index], newMembers[index - 1]] = [
        newMembers[index - 1],
        newMembers[index],
      ];
    } else if (direction === "down" && index < newMembers.length - 1) {
      [newMembers[index], newMembers[index + 1]] = [
        newMembers[index + 1],
        newMembers[index],
      ];
    } else {
      return;
    }

    // Optimistically update UI
    setMembers(newMembers);
    setLoading(true);

    try {
      // Update all display orders to ensure consistency using update (not upsert to avoid nullifying other columns)
      const updatePromises = newMembers.map((member, i) =>
        supabase
          .from("team_members")
          .update({ display_order: i + 1 })
          .eq("id", member.id)
          .select(),
      );

      const results = await Promise.all(updatePromises);
      const errors = results.filter((r) => r.error);
      const denied = results.filter(
        (r) => !r.error && (!r.data || r.data.length === 0),
      );

      if (errors.length > 0) {
        console.error("Errors updating order:", errors);
        customAlert("Failed to save new order: " + errors[0].error!.message);
      } else if (denied.length > 0) {
        console.error("Permission denied for some updates");
        customAlert("Permission denied. You may not have admin rights.");
      }
    } catch (error) {
      console.error("Failed to update order:", error);
    } finally {
      setLoading(false);
      // Re-fetch to ensure we have the latest state from DB
      fetchTeam();
    }
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-blue">Team Members</h2>
        <button
          onClick={() =>
            setEditing({ name: "", role: "", bio: "", image_url: "" })
          }
          className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Member
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {members.map((m: any, idx: number) => (
          <div
            key={m.id}
            className="bg-white p-6 rounded-xl border border-gray-100 flex items-center gap-6 relative group hover:shadow-md transition"
          >
            <div className="flex flex-col gap-2">
              <button
                onClick={() => moveMember(idx, "up")}
                disabled={idx === 0 || loading}
                className="p-2 bg-gray-50 rounded-lg text-gray-500 disabled:opacity-30 hover:bg-gray-200 hover:text-brand-blue transition"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <button
                onClick={() => moveMember(idx, "down")}
                disabled={idx === members.length - 1 || loading}
                className="p-2 bg-gray-50 rounded-lg text-gray-500 disabled:opacity-30 hover:bg-gray-200 hover:text-brand-blue transition"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            <img
              src={m.image_url || m.image}
              className="w-24 h-24 rounded-full object-cover shadow-sm"
            />

            <div className="flex-1 text-left">
              <h3 className="text-xl font-bold text-gray-800">{m.name}</h3>
              <p className="text-sm text-brand-red font-bold uppercase mb-2">
                {m.role}
              </p>
              <p className="text-gray-600 text-sm">{m.bio}</p>
            </div>

            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => setEditing(m)}
                className="p-2 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-100 transition"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteMember(m.id)}
                className="p-2 bg-red-50 rounded-lg text-red-600 hover:bg-red-100 transition"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Modal
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Team Member"
      >
        {editing && (
          <div className="space-y-4">
            <input
              placeholder="Name"
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              className="w-full border p-2 rounded-lg"
            />
            <input
              placeholder="Role"
              value={editing.role}
              onChange={(e) => setEditing({ ...editing, role: e.target.value })}
              className="w-full border p-2 rounded-lg"
            />
            <textarea
              placeholder="Bio"
              value={editing.bio}
              onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
              className="w-full border p-2 rounded-lg"
              rows={3}
            />
            <ImageUpload
              value={editing.image_url}
              onChange={(url) => setEditing({ ...editing, image_url: url })}
            />
            <ApprovalControls
              item={editing}
              setItem={setEditing}
              onSave={saveMember}
              loading={loading}
              userRole={userRole}
              userEmail={userEmail}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

const TestimonialsManager = ({
  userRole,
  userEmail,
  userId,
}: {
  userRole: AdminRole | null;
  userEmail: string | undefined;
  userId: string | undefined;
}) => {
  const [list, setList] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fetchTestimonials = async () => {
    if (isSupabaseConfigured()) {
      let query = supabase.from("testimonials").select("*").neq("is_deleted", true);
      if (userRole === "content_creator") query = query.eq("author_id", userId);
      const { data } = await query;
      if (data) setList(data);
    } else setList([]);
  };
  useEffect(() => {
    fetchTestimonials();
  }, []);
  const saveTestimonial = async (status: string) => {
    if (isSupabaseConfigured() && editing) {
      setLoading(true);
      const { id, ...updateData } = editing;
      updateData.approval_status = status;
      updateData.author_email = updateData.author_email || userEmail;
      updateData.author_id = updateData.author_id || userId;
      const query = id
        ? supabase.from("testimonials").update(updateData).eq("id", id)
        : supabase.from("testimonials").insert(updateData);
      const { data, error } = await query.select();
      setLoading(false);
      if (error) customAlert("Error: " + error.message);
      else if (!data || data.length === 0) customAlert("Permission denied.");
      else {
        setEditing(null);
        fetchTestimonials();
      }
    }
  };
  const deleteTestimonial = async (id: number) => {
    if (await customConfirm("Delete?")) {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from("testimonials")
          .update({ is_deleted: true })
          .eq("id", id);
        if (error) customAlert("Error deleting: " + error.message);
        else fetchTestimonials();
      }
    }
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-blue">Testimonials</h2>
        <button
          onClick={() =>
            setEditing({
              name: "",
              role: "",
              content: "",
              approval_status:
                userRole === "content_creator" ? "draft" : "published",
            })
          }
          className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Testimonial
        </button>
      </div>
      <div className="grid gap-4">
        {list.map((t: any, i) => (
          <div
            key={t.id || i}
            className="bg-white p-4 rounded-xl border border-gray-100 relative group"
          >
            <p className="italic text-gray-600 mb-2">"{t.content || t.text}"</p>
            <p className="text-xs font-bold text-gray-800 flex items-center gap-2">
              - {t.name}, {t.role}{" "}
              <span
                className={`text-[10px] px-2 py-0.5 rounded uppercase ${t.approval_status === "published" ? "bg-green-100 text-green-700" : t.approval_status === "pending" ? "bg-yellow-100 text-yellow-700" : t.approval_status === "rejected" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}
              >
                {t.approval_status || "published"}
              </span>
            </p>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => setEditing(t)}
                className="p-1 bg-gray-50 rounded text-blue-600"
              >
                <Edit className="w-3 h-3" />
              </button>
              <button
                onClick={() => deleteTestimonial(t.id)}
                className="p-1 bg-gray-50 rounded text-red-600"
              >
                <Trash className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <Modal
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Testimonial"
      >
        {editing && (
          <div className="space-y-4">
            <input
              placeholder="Name"
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              className="w-full border p-2 rounded-lg"
            />
            <input
              placeholder="Role"
              value={editing.role}
              onChange={(e) => setEditing({ ...editing, role: e.target.value })}
              className="w-full border p-2 rounded-lg"
            />
            <textarea
              placeholder="Content"
              value={editing.content}
              onChange={(e) =>
                setEditing({ ...editing, content: e.target.value })
              }
              className="w-full border p-2 rounded-lg"
              rows={3}
            />
            <ApprovalControls
              item={editing}
              setItem={setEditing}
              onSave={saveTestimonial}
              loading={loading}
              userRole={userRole}
              userEmail={userEmail}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

const BackendSetupView = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const copySQL = () => {
    navigator.clipboard.writeText(GENERATED_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const quickFixSQL = user?.email
    ? `INSERT INTO public.admin_whitelist (email, role) VALUES ('${user.email}', 'super_admin') ON CONFLICT (email) DO UPDATE SET role = 'super_admin';
ALTER TABLE public.team_members ALTER COLUMN display_order DROP IDENTITY IF EXISTS;
ALTER TABLE public.team_members ALTER COLUMN display_order SET DEFAULT 0;
ALTER TABLE public.donation_funds ALTER COLUMN display_order DROP IDENTITY IF EXISTS;
ALTER TABLE public.donation_funds ALTER COLUMN display_order SET DEFAULT 0;
ALTER TABLE public.impact_stats ALTER COLUMN display_order DROP IDENTITY IF EXISTS;
ALTER TABLE public.impact_stats ALTER COLUMN display_order SET DEFAULT 0;
ALTER TABLE public.mission_groups ALTER COLUMN display_order DROP IDENTITY IF EXISTS;
ALTER TABLE public.mission_groups ALTER COLUMN display_order SET DEFAULT 0;
ALTER TABLE public.mission_causes ALTER COLUMN display_order DROP IDENTITY IF EXISTS;
ALTER TABLE public.mission_causes ALTER COLUMN display_order SET DEFAULT 0;

-- Update is_admin function to include viewer and stakeholder
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
begin
  return (auth.role() = 'authenticated' AND exists (
    select 1 from public.profiles
    where id = auth.uid()
    AND role IN ('super_admin', 'content_manager', 'content_creator', 'volunteer_manager', 'viewer', 'stakeholder')
  ));
end;
$$;

-- Secure Default Role Assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  assigned_role text;
BEGIN
  SELECT role INTO assigned_role FROM public.admin_whitelist WHERE lower(email) = lower(new.email);
  IF assigned_role IS NULL THEN
    SELECT application_type INTO assigned_role 
    FROM public.volunteer_applications 
    WHERE lower(email) = lower(new.email) AND status = 'approved' 
    LIMIT 1;
    IF assigned_role = 'internship' THEN
      assigned_role := 'intern';
    ELSIF assigned_role = 'volunteer' THEN
      assigned_role := 'volunteer';
    ELSE
      assigned_role := 'user';
    END IF;
  END IF;

  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, assigned_role)
  ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`
    : "";
  const copyQuickFix = () => {
    navigator.clipboard.writeText(quickFixSQL);
    customAlert("Copied to clipboard! Run this in Supabase SQL Editor.");
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-blue">Backend Setup</h2>
        <button
          onClick={copySQL}
          className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold flex items-center"
        >
          {copied ? (
            <CircleCheck className="w-4 h-4 mr-2" />
          ) : (
            <Copy className="w-4 h-4 mr-2" />
          )}{" "}
          Copy Full SQL
        </button>
      </div>
      {user?.email && (
        <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200">
          <h3 className="font-bold text-yellow-800 mb-2 flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2" /> Quick Fix: Grant Super
            Admin Access
          </h3>
          <p className="text-sm text-yellow-700 mb-4">
            If you are locked out or seeing "Permission Denied", run this
            command to promote your email <strong>({user.email})</strong> to
            Super Admin:
          </p>
          <div className="flex gap-2">
            <code className="flex-1 bg-white p-3 rounded-lg border border-yellow-300 text-xs font-mono overflow-x-auto text-gray-700">
              {quickFixSQL}
            </code>
            <button
              onClick={copyQuickFix}
              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-4 rounded-lg font-bold text-sm"
            >
              Copy
            </button>
          </div>
        </div>
      )}
      <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 border border-blue-100">
        <strong>Instructions:</strong> Go to the Supabase Dashboard -&gt; SQL
        Editor, paste the script below, and run it to create all necessary
        tables, policies, and initial seed data.
      </div>
      <div className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto font-mono text-xs max-h-96 border border-gray-700">
        <pre>{GENERATED_SQL}</pre>
      </div>
    </div>
  );
};

const FundsManager = () => {
  const [funds, setFunds] = useState<any[]>([]);
  const [editingFund, setEditingFund] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchFunds = async () => {
    if (isSupabaseConfigured()) {
      const { data } = await supabase
        .from("donation_funds")
        .select("*")
        .neq("is_deleted", true)
        .order("display_order");
      if (data) setFunds(data);
    } else {
      setFunds(DONATION_FUNDS);
    }
  };
  useEffect(() => {
    fetchFunds();
  }, []);
  const saveFund = async () => {
    if (!editingFund.id || !editingFund.name) return;
    if (isSupabaseConfigured()) {
      setLoading(true);
      const { display_order, ...updateData } = editingFund;
      const { data, error } = await supabase
        .from("donation_funds")
        .upsert(updateData)
        .select();
      setLoading(false);
      if (error) customAlert("Error: " + error.message);
      else if (!data || data.length === 0) customAlert("Permission denied.");
      else {
        setEditingFund(null);
        fetchFunds();
      }
    } else {
      customAlert("Connect DB to save.");
    }
  };
  const deleteFund = async (id: string) => {
    if (await customConfirm("Delete this fund option?")) {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from("donation_funds")
          .update({ is_deleted: true })
          .eq("id", id);
        if (error) customAlert("Error deleting: " + error.message);
        else fetchFunds();
      }
    }
  };
  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-blue">Donation Funds</h2>
        <button
          onClick={() => setEditingFund({ id: "", name: "", is_active: true })}
          className="bg-brand-blue text-white px-4 py-2 rounded-xl font-bold flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Fund
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Fund Name</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {funds.map((f) => (
              <tr
                key={f.id}
                className="hover:bg-gray-50 border-b border-gray-50 last:border-0"
              >
                <td className="px-6 py-4 font-mono text-xs text-gray-500">
                  {f.id}
                </td>
                <td className="px-6 py-4 font-bold text-gray-800">{f.name}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${f.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    {f.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 flex space-x-2">
                  <button
                    onClick={() => setEditingFund(f)}
                    className="text-brand-blue hover:text-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteFund(f.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={!!editingFund}
        onClose={() => setEditingFund(null)}
        title={editingFund?.name ? "Edit Fund" : "New Fund"}
      >
        {editingFund && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Fund ID (Unique)
              </label>
              <input
                value={editingFund.id}
                onChange={(e) =>
                  setEditingFund({ ...editingFund, id: e.target.value })
                }
                className="w-full border p-2 rounded-lg font-mono text-sm"
                placeholder="e.g. disaster_relief"
                disabled={
                  !!funds.find((f) => f.id === editingFund.id && f.name !== "")
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Fund Name
              </label>
              <input
                value={editingFund.name}
                onChange={(e) =>
                  setEditingFund({ ...editingFund, name: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
                placeholder="Display Name"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editingFund.is_active}
                onChange={(e) =>
                  setEditingFund({
                    ...editingFund,
                    is_active: e.target.checked,
                  })
                }
                className="w-4 h-4"
              />
              <label className="text-sm font-bold text-gray-700">
                Active (Visible to Donors)
              </label>
            </div>
            <button
              onClick={saveFund}
              disabled={loading}
              className="w-full bg-brand-green text-white py-3 rounded-xl font-bold mt-4"
            >
              {loading ? "Saving..." : "Save Fund"}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

const ANNOUNCEMENT_LABELS = ["", "NEW", "URGENT", "EVENT"];

const AnnouncementsManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    if (isSupabaseConfigured()) {
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .neq("is_deleted", true)
        .order("display_order");
      if (data) setItems(data);
    }
  };
  useEffect(() => {
    fetchItems();
  }, []);

  const saveItem = async () => {
    if (!editingItem.message) {
      customAlert("Message is required.");
      return;
    }
    if (isSupabaseConfigured()) {
      setLoading(true);
      const { display_order, ...updateData } = editingItem;
      // Empty-string label means "no tag chip" — store as null rather than ""
      // so the frontend's `item.label &&` check behaves consistently.
      const payload = { ...updateData, label: updateData.label || null };
      const { data, error } = await supabase
        .from("announcements")
        .upsert(payload)
        .select();
      setLoading(false);
      if (error) customAlert("Error: " + error.message);
      else if (!data || data.length === 0) customAlert("Permission denied.");
      else {
        setEditingItem(null);
        fetchItems();
      }
    } else {
      customAlert("Connect DB to save.");
    }
  };

  const deleteItem = async (id: number) => {
    if (await customConfirm("Delete this announcement?")) {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from("announcements")
          .update({ is_deleted: true })
          .eq("id", id);
        if (error) customAlert("Error deleting: " + error.message);
        else fetchItems();
      }
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-blue">Announcement Bar</h2>
        <button
          onClick={() =>
            setEditingItem({ message: "", label: "", link_url: "", is_active: true })
          }
          className="bg-brand-blue text-white px-4 py-2 rounded-xl font-bold flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Announcement
        </button>
      </div>
      <p className="text-sm text-gray-500 -mt-6">
        These scroll in the ticker bar above the header, site-wide. Order below is the
        scroll order.
      </p>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Tag</th>
              <th className="px-6 py-4">Message</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 border-b border-gray-50 last:border-0"
              >
                <td className="px-6 py-4">
                  {item.label ? (
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-extrabold uppercase ${
                        item.label === "URGENT"
                          ? "bg-red-100 text-red-700"
                          : item.label === "NEW"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.label}
                    </span>
                  ) : (
                    <span className="text-gray-300 text-xs">—</span>
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-gray-800 max-w-md truncate">
                  {item.message}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    {item.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 flex space-x-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="text-brand-blue hover:text-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-sm">
                  No announcements yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title={editingItem?.id ? "Edit Announcement" : "New Announcement"}
      >
        {editingItem && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Message
              </label>
              <textarea
                value={editingItem.message}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, message: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
                rows={2}
                placeholder="e.g. Registrations for the Winter Health Camp are now open"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Tag
              </label>
              <select
                value={editingItem.label || ""}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, label: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
              >
                {ANNOUNCEMENT_LABELS.map((l) => (
                  <option key={l} value={l}>
                    {l || "No tag"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Link URL (optional)
              </label>
              <input
                value={editingItem.link_url || ""}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, link_url: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editingItem.is_active}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, is_active: e.target.checked })
                }
                className="w-4 h-4"
              />
              <label className="text-sm font-bold text-gray-700">
                Active (Visible on site)
              </label>
            </div>
            <button
              onClick={saveItem}
              disabled={loading}
              className="w-full bg-brand-green text-white py-3 rounded-xl font-bold mt-4"
            >
              {loading ? "Saving..." : "Save Announcement"}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

const MissionManager = ({
  userRole,
  userEmail,
  userId,
}: {
  userRole: AdminRole | null;
  userEmail: string | undefined;
  userId: string | undefined;
}) => {
  const [groups, setGroups] = useState<any[]>([]);
  const [causes, setCauses] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
  const [editingCause, setEditingCause] = useState<any | null>(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const fetchMissionData = async () => {
    if (isSupabaseConfigured()) {
      const { data: gs } = await supabase
        .from("mission_groups")
        .select("*")
        .order("display_order");
      let csQuery = supabase
        .from("mission_causes")
        .select("*")
        .neq("is_deleted", true)
        .order("display_order");
      if (userRole === "content_creator")
        csQuery = csQuery.eq("author_id", userId);
      const { data: cs } = await csQuery;
      if (gs) setGroups(gs);
      if (cs) setCauses(cs);
    }
  };
  useEffect(() => {
    fetchMissionData();
  }, []);
  const saveCause = async (status: string) => {
    if (!editingCause.title || !editingCause.group_id) return;
    if (isSupabaseConfigured()) {
      setLoading(true);
      const { id, display_order, ...updateData } = editingCause;
      updateData.approval_status = status;
      updateData.author_email = updateData.author_email || userEmail;
      updateData.author_id = updateData.author_id || userId;
      const query = id
        ? supabase.from("mission_causes").update(updateData).eq("id", id)
        : supabase.from("mission_causes").insert(updateData);
      const { data, error } = await query.select();
      setLoading(false);
      if (error) customAlert("Error saving: " + error.message);
      else if (!data || data.length === 0) customAlert("Permission denied.");
      else {
        setEditingCause(null);
        fetchMissionData();
      }
    }
  };
  const deleteCause = async (id: number) => {
    if (await customConfirm("Are you sure?")) {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from("mission_causes")
          .update({ is_deleted: true })
          .eq("id", id);
        if (error) customAlert("Error deleting: " + error.message);
        else fetchMissionData();
      }
    }
  };
  return (
    <div className="animate-fade-in space-y-8">
      <h2 className="text-2xl font-bold text-brand-blue">Mission & Causes</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <h3 className="font-bold text-gray-700">Mission Groups</h3>
          {groups.map((g) => (
            <div
              key={g.id}
              onClick={() => setSelectedGroup(g)}
              className={`p-4 rounded-xl cursor-pointer border transition-all ${selectedGroup?.id === g.id ? "bg-blue-50 border-brand-blue shadow-md" : "bg-white border-gray-100 hover:bg-gray-50"}`}
            >
              <div className="flex items-center space-x-3">
                {/* @ts-ignore */}
                {React.createElement(
                  LucideIcons[g.icon] || LucideIcons.CircleHelp,
                  { className: "w-5 h-5 text-gray-500" },
                )}
                <span className="font-bold text-sm text-gray-800">
                  {g.title}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800">
              {selectedGroup
                ? `Causes in "${selectedGroup.title}"`
                : "Select a Group"}
            </h3>
            {selectedGroup && (
              <button
                onClick={() =>
                  setEditingCause({
                    group_id: selectedGroup.id,
                    title: "",
                    description: "",
                    icon: "Heart",
                    approval_status:
                      userRole === "content_creator" ? "draft" : "published",
                  })
                }
                className="bg-brand-green text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Cause
              </button>
            )}
          </div>
          {selectedGroup && (
            <div className="space-y-3">
              {causes
                .filter((c) => c.group_id === selectedGroup.id)
                .map((c) => (
                  <div
                    key={c.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100 group"
                  >
                    <div className="flex items-center space-x-3">
                      {/* @ts-ignore */}
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        {React.createElement(
                          LucideIcons[c.icon] || LucideIcons.CircleHelp,
                          { className: "w-4 h-4 text-brand-blue" },
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-gray-800 flex items-center gap-2">
                          {c.title}{" "}
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded uppercase ${c.approval_status === "published" ? "bg-green-100 text-green-700" : c.approval_status === "pending" ? "bg-yellow-100 text-yellow-700" : c.approval_status === "rejected" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}
                          >
                            {c.approval_status || "published"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          {c.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingCause(c)}
                        className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteCause(c.id)}
                        className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      >
                        <Trash className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              {causes.filter((c) => c.group_id === selectedGroup.id).length ===
                0 && (
                <p className="text-center text-gray-400 text-xs py-8">
                  No causes added yet.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={!!editingCause}
        onClose={() => {
          setEditingCause(null);
          setShowIconPicker(false);
        }}
        title={editingCause?.id ? "Edit Cause" : "Add Cause"}
      >
        {editingCause && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Title
              </label>
              <input
                value={editingCause.title}
                onChange={(e) =>
                  setEditingCause({ ...editingCause, title: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
                placeholder="e.g., Clean Water Initiative"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Description
              </label>
              <textarea
                value={editingCause.description}
                onChange={(e) =>
                  setEditingCause({
                    ...editingCause,
                    description: e.target.value,
                  })
                }
                className="w-full border p-2 rounded-lg"
                rows={3}
                placeholder="e.g., Providing access to safe drinking water..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Icon
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowIconPicker(!showIconPicker)}
                  className="flex items-center justify-between w-full border p-2 rounded-lg bg-white text-left"
                >
                  <span className="flex items-center">
                    {/* @ts-ignore */}
                    {React.createElement(
                      LucideIcons[editingCause.icon] || LucideIcons.CircleHelp,
                      { className: "w-4 h-4 mr-2" },
                    )}
                    {editingCause.icon}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${showIconPicker ? "rotate-90" : ""}`}
                  />
                </button>
                {showIconPicker && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-xl shadow-xl z-50 p-2 grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
                    {VALID_ICONS.map((iconName) => (
                      <button
                        key={iconName}
                        onClick={() => {
                          setEditingCause({ ...editingCause, icon: iconName });
                          setShowIconPicker(false);
                        }}
                        className={`p-2 rounded-lg hover:bg-gray-100 flex justify-center ${editingCause.icon === iconName ? "bg-blue-50 text-blue-600" : "text-gray-600"}`}
                        title={iconName}
                      >
                        {/* @ts-ignore */}
                        {React.createElement(
                          LucideIcons[iconName] || LucideIcons.CircleHelp,
                          { className: "w-5 h-5" },
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <ApprovalControls
              item={editingCause}
              setItem={setEditingCause}
              onSave={saveCause}
              loading={loading}
              userRole={userRole}
              userEmail={userEmail}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

const SettingsView = () => {
  const [tab, setTab] = useState("home");
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const GROUPS: Record<string, string[]> = {
    home: [
      "home_hero_title",
      "home_hero_subtitle",
      "home_hero_bg",
      "home_video_url",
      "home_video_poster",
      "home_slogan",
      "home_explore_btn",
      "home_impact_heading",
    ],
    about: [
      "about_hero_title",
      "about_hero_subtitle",
      "about_hero_image",
      "about_story_title",
      "about_story_content",
      "about_story_image",
      "about_vision_text",
      "about_leadership_title",
    ],
    work: [
      "work_hero_title",
      "work_hero_subtitle",
      "work_hero_image",
      "work_methodology_title",
      "work_methodology_desc",
      "work_verticals_title",
      "work_verticals_subtitle",
    ],
    impact: ["impact_hero_title", "impact_hero_subtitle", "impact_hero_image"],
    blog: ["blog_hero_title", "blog_hero_subtitle"],
    gallery: ["gallery_hero_title", "gallery_hero_subtitle"],
    partners: [
      "partner_hero_title",
      "partner_hero_subtitle",
      "partner_hero_image",
      "partner_proposal_title",
      "partner_proposal_text",
    ],
    volunteer_signup: [
      "volsignup_hero_title",
      "volsignup_hero_subtitle",
      "volsignup_hero_image",
      "volsignup_quote",
      "volsignup_form_title",
      "volsignup_success_title",
      "volsignup_success_msg",
    ],
  };

  const HELP_TEXTS: Record<string, string> = {
    home_hero_title:
      "The main, large headline displayed at the very top of the home page.",
    home_hero_subtitle:
      "The smaller text displayed just below the main headline on the home page.",
    home_hero_bg:
      "URL of the background image for the top section of the home page.",
    home_video_url:
      "YouTube link for the main video (e.g., https://www.youtube.com/watch?v=...).",
    home_video_poster: "URL of the image shown before the video is played.",
    home_slogan:
      "A short, catchy phrase displayed prominently on the home page.",
    home_explore_btn:
      "Text for the primary call-to-action button on the home page.",
    home_impact_heading:
      "Headline for the section showcasing your organization's impact statistics.",

    about_hero_title: "The main headline at the top of the About Us page.",
    about_hero_subtitle:
      "The smaller text below the main headline on the About Us page.",
    about_hero_image:
      "URL of the main image displayed at the top of the About Us page.",
    about_story_title:
      "Headline for the section detailing your organization's history or story.",
    about_story_content:
      "The main text content telling your organization's story.",
    about_story_image:
      "URL of the image accompanying your organization's story.",
    about_vision_text:
      "Text describing your organization's vision for the future.",
    about_leadership_title:
      "Headline for the section introducing your team or leadership.",

    work_hero_title: "The main headline at the top of the Our Work page.",
    work_hero_subtitle:
      "The smaller text below the main headline on the Our Work page.",
    work_hero_image:
      "URL of the main image displayed at the top of the Our Work page.",
    work_methodology_title:
      "Headline for the section explaining how your organization operates.",
    work_methodology_desc:
      "Detailed text describing your organization's methodology or approach.",
    work_verticals_title:
      "Headline for the section listing your main areas of work or programs.",
    work_verticals_subtitle:
      "Short description below the verticals/programs headline.",

    impact_hero_title: "The main headline at the top of the Impact page.",
    impact_hero_subtitle:
      "The smaller text below the main headline on the Impact page.",
    impact_hero_image:
      "URL of the main image displayed at the top of the Impact page.",

    blog_hero_title: "The main headline at the top of the Blog/News page.",
    blog_hero_subtitle:
      "The smaller text below the main headline on the Blog/News page.",

    gallery_hero_title:
      "The main headline at the top of the Photo Gallery page.",
    gallery_hero_subtitle:
      "The smaller text below the main headline on the Photo Gallery page.",

    partner_hero_title: "The main headline at the top of the Partners page.",
    partner_hero_subtitle:
      "The smaller text below the main headline on the Partners page.",
    partner_hero_image:
      "URL of the main image displayed at the top of the Partners page.",
    partner_proposal_title:
      "Headline for the section inviting new partnerships.",
    partner_proposal_text:
      "Text explaining why and how organizations should partner with you.",

    volsignup_hero_title:
      "The main headline at the top of the Volunteer Signup page.",
    volsignup_hero_subtitle:
      "The smaller text below the main headline on the Volunteer Signup page.",
    volsignup_hero_image:
      "URL of the main image displayed at the top of the Volunteer Signup page.",
    volsignup_quote:
      "An inspiring quote displayed on the volunteer signup page.",
    volsignup_form_title: "Headline displayed directly above the signup form.",
    volsignup_success_title:
      "Headline shown after a volunteer successfully submits the form.",
    volsignup_success_msg:
      "Message shown after a volunteer successfully submits the form.",
  };

  const PLACEHOLDERS: Record<string, string> = {
    home_hero_title: "e.g., Heal.\\nEmpower.\\nRise.",
    home_hero_subtitle:
      "e.g., Bennu Rising International Foundation is a holistic humanitarian force. He who came into being by himself",
    home_hero_bg: "e.g., https://images.unsplash.com/photo-123456789",
    home_video_url: "e.g., https://www.youtube.com/watch?v=Ef6vpu3D9aw",
    home_video_poster: "e.g., https://images.unsplash.com/photo-123456789",
    home_slogan: "e.g., Lokah Samastha Sukhino Bhavantu",
    home_explore_btn: "e.g., Explore Causes",
    home_impact_heading: "e.g., Our Impact So Far",

    about_hero_title: "e.g., About Us",
    about_hero_subtitle: "e.g., Learn more about our mission and vision.",
    about_hero_image: "e.g., https://images.unsplash.com/photo-123456789",
    about_story_title: "e.g., Our Story",
    about_story_content: "e.g., Bennu Rising was founded in...",
    about_story_image: "e.g., https://images.unsplash.com/photo-123456789",
    about_vision_text: "e.g., A world where everyone has access to...",
    about_leadership_title: "e.g., Meet Our Leadership",

    work_hero_title: "e.g., Our Work",
    work_hero_subtitle: "e.g., Discover the projects we are working on.",
    work_hero_image: "e.g., https://images.unsplash.com/photo-123456789",
    work_methodology_title: "e.g., How We Work",
    work_methodology_desc: "e.g., We believe in a community-first approach...",
    work_verticals_title: "e.g., Our Core Verticals",
    work_verticals_subtitle: "e.g., Areas where we make the most impact.",

    impact_hero_title: "e.g., Our Impact",
    impact_hero_subtitle: "e.g., See the difference we've made together.",
    impact_hero_image: "e.g., https://images.unsplash.com/photo-123456789",

    blog_hero_title: "e.g., Latest News",
    blog_hero_subtitle: "e.g., Updates and stories from the field.",

    gallery_hero_title: "e.g., Photo Gallery",
    gallery_hero_subtitle: "e.g., Moments captured from our projects.",

    partner_hero_title: "e.g., Partner With Us",
    partner_hero_subtitle: "e.g., Join hands to create a bigger impact.",
    partner_hero_image: "e.g., https://images.unsplash.com/photo-123456789",
    partner_proposal_title: "e.g., Why Partner With Bennu Rising?",
    partner_proposal_text: "e.g., We offer transparent reporting and...",

    volsignup_hero_title: "e.g., Volunteer With Us",
    volsignup_hero_subtitle: "e.g., Become a part of our global family.",
    volsignup_hero_image: "e.g., https://images.unsplash.com/photo-123456789",
    volsignup_quote:
      "e.g., 'The best way to find yourself is to lose yourself in the service of others.'",
    volsignup_form_title: "e.g., Application Form",
    volsignup_success_title: "e.g., Thank You!",
    volsignup_success_msg:
      "e.g., We have received your application and will be in touch soon.",
  };

  const fetchConfig = async () => {
    if (isSupabaseConfigured()) {
      const allKeys = Object.values(GROUPS).flat();
      const { data } = await supabase
        .from("system_settings")
        .select("*")
        .in("key", allKeys);
      if (data) {
        const newConfig: Record<string, string> = {};
        data.forEach((d) => (newConfig[d.key] = d.value));
        setConfig(newConfig);
      }
    }
  };
  useEffect(() => {
    fetchConfig();
  }, []);
  const handleChange = (key: string, val: string) => {
    setConfig((prev) => ({ ...prev, [key]: val }));
  };
  const saveConfig = async () => {
    setLoading(true);
    if (isSupabaseConfigured()) {
      const keysToSave = GROUPS[tab];
      const updates = keysToSave.map((key) => ({
        key,
        value: config[key] || "",
        updated_at: new Date().toISOString(),
      }));
      const { error } = await supabase.from("system_settings").upsert(updates);
      if (error) customAlert("Error: " + error.message);
      else customAlert("Saved successfully!");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-blue">
          Page Content Settings
        </h2>
        <button
          onClick={saveConfig}
          disabled={loading}
          className="bg-brand-blue text-white px-6 py-2 rounded-xl font-bold shadow-sm hover:shadow-md transition flex items-center"
        >
          {loading ? (
            <Loader2 className="animate-spin w-4 h-4 mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}{" "}
          Save {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      </div>
      <div className="flex space-x-2 border-b border-gray-200 overflow-x-auto pb-1 mb-6">
        {Object.keys(GROUPS).map((g) => (
          <button
            key={g}
            onClick={() => setTab(g)}
            className={`px-4 py-2 text-sm font-bold rounded-t-lg transition whitespace-nowrap capitalize ${tab === g ? "bg-white border-t border-x border-gray-200 text-brand-blue" : "text-gray-500 hover:bg-gray-50"}`}
          >
            {g.replace("_", " ")}
          </button>
        ))}
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid gap-6">
        {GROUPS[tab].map((key) => (
          <div key={key}>
            <div className="mb-2">
              <label className="block text-sm font-bold text-gray-800 uppercase">
                {key.replace(/_/g, " ")}
              </label>
              {HELP_TEXTS[key] && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {HELP_TEXTS[key]}
                </p>
              )}
            </div>
            {key.includes("image") ||
            key.includes("bg") ||
            key.includes("poster") ||
            key.includes("logo") ||
            key.includes("icon") ||
            key.includes("avatar") ||
            key.includes("photo") ? (
              <ImageUpload
                value={config[key] || ""}
                onChange={(url) => handleChange(key, url)}
              />
            ) : key.includes("content") ||
            key.includes("text") ||
            key.includes("msg") ||
            key.includes("desc") ? (
              <textarea
                value={config[key] || ""}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none"
                rows={4}
                placeholder={
                  PLACEHOLDERS[key] || `Enter ${key.replace(/_/g, " ")}...`
                }
              />
            ) : (
              <input
                value={config[key] || ""}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none"
                placeholder={
                  PLACEHOLDERS[key] || `Enter ${key.replace(/_/g, " ")}...`
                }
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const GlobalConfigManager = () => {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const KEYS = [
    "contact_address",
    "contact_phone",
    "contact_email",
    "footer_slogan",
    "razorpay_key_id",
    "visitor_baseline_count",
    "visitor_tracker_enabled",
    "enable_80g_tax_exemption",
    "enable_monthly_donations",
  ];

  const PLACEHOLDERS: Record<string, string> = {
    contact_address: "e.g., 123 Hope Street, New York, NY 10001",
    contact_phone: "e.g., +1 (555) 123-4567",
    contact_email: "e.g., contact@bennurising.org",
    footer_slogan: "e.g., Empowering communities worldwide.",
    razorpay_key_id: "e.g., rzp_live_xxxxxxxxxxxxxx",
    visitor_baseline_count: "e.g., 124830",
    visitor_tracker_enabled: "e.g., true",
    enable_80g_tax_exemption: "e.g., true",
    enable_monthly_donations: "e.g., true",
  };

  useEffect(() => {
    const fetch = async () => {
      if (isSupabaseConfigured()) {
        const { data } = await supabase
          .from("system_settings")
          .select("*")
          .in("key", KEYS);
        if (data) {
          const c: any = {};
          data.forEach((d) => (c[d.key] = d.value));
          setConfig(c);
        }
      }
    };
    fetch();
  }, []);
  const save = async () => {
    setLoading(true);
    if (isSupabaseConfigured()) {
      const updates = KEYS.map((key) => ({
        key,
        value: config[key] || "",
        updated_at: new Date().toISOString(),
      }));
      const { error } = await supabase.from("system_settings").upsert(updates);
      if (error) customAlert("Error: " + error.message);
      else customAlert("Saved!");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-blue">
          Global Configuration
        </h2>
        <button
          onClick={save}
          disabled={loading}
          className="bg-brand-blue text-white px-6 py-2 rounded-xl font-bold shadow-sm"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <MapPin className="w-4 h-4 mr-2" /> Contact Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Address
              </label>
              <p className="text-[10px] text-gray-400 mb-1">
                The physical address of your organization, displayed in the
                footer and contact sections.
              </p>
              <textarea
                value={config["contact_address"] || ""}
                onChange={(e) =>
                  setConfig({ ...config, contact_address: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
                rows={3}
                placeholder={PLACEHOLDERS["contact_address"]}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Phone
              </label>
              <p className="text-[10px] text-gray-400 mb-1">
                The primary contact phone number, displayed in the footer and
                contact sections.
              </p>
              <input
                value={config["contact_phone"] || ""}
                onChange={(e) =>
                  setConfig({ ...config, contact_phone: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
                placeholder={PLACEHOLDERS["contact_phone"]}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Email
              </label>
              <p className="text-[10px] text-gray-400 mb-1">
                The primary contact email address, displayed in the footer and
                contact sections.
              </p>
              <input
                value={config["contact_email"] || ""}
                onChange={(e) =>
                  setConfig({ ...config, contact_email: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
                placeholder={PLACEHOLDERS["contact_email"]}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Footer Slogan
              </label>
              <p className="text-[10px] text-gray-400 mb-1">
                A short phrase or mission statement displayed at the very bottom
                of every page.
              </p>
              <textarea
                value={config["footer_slogan"] || ""}
                onChange={(e) =>
                  setConfig({ ...config, footer_slogan: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
                rows={2}
                placeholder={PLACEHOLDERS["footer_slogan"]}
              />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <CreditCard className="w-4 h-4 mr-2" /> Payment Gateway
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Razorpay Key ID
              </label>
              <p className="text-[10px] text-gray-400 mb-1">
                Your Razorpay API Key ID (used for processing donations).
              </p>
              <input
                value={config["razorpay_key_id"] || ""}
                onChange={(e) =>
                  setConfig({ ...config, razorpay_key_id: e.target.value })
                }
                className="w-full border p-2 rounded-lg font-mono text-sm"
                placeholder={PLACEHOLDERS["razorpay_key_id"]}
              />
            </div>
            {/* razorpay_plan_id field removed — /api/create-subscription now creates
                a Razorpay Plan matching each donor's exact amount on the fly (see
                server.ts), instead of relying on one static admin-configured plan_id
                that ignored whatever amount the donor actually picked. */}
          </div>
        </div>

        
        {/* Tax & Legal Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2 mt-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <LucideIcons.ShieldCheck className="w-4 h-4 mr-2 text-brand-green" /> Tax & Legal Settings
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                80G Tax Exemption
              </label>
              <p className="text-[10px] text-gray-400 mb-1">
                Enable or disable the 80G Tax Exemption features across the website.
              </p>
              <select
                value={config["enable_80g_tax_exemption"] || "false"}
                onChange={(e) =>
                  setConfig({ ...config, enable_80g_tax_exemption: e.target.value })
                }
                className="w-full border p-2.5 rounded-lg bg-white"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Monthly Donations
              </label>
              <p className="text-[10px] text-gray-400 mb-1">
                Show the "Monthly" recurring option on the donation widget and
                donate page. When disabled, only one-time donations are offered
                — existing active subscriptions are unaffected either way.
              </p>
              <select
                value={config["enable_monthly_donations"] || "true"}
                onChange={(e) =>
                  setConfig({ ...config, enable_monthly_donations: e.target.value })
                }
                className="w-full border p-2.5 rounded-lg bg-white"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Visitor Counter Analytics Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2 mt-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <Users className="w-4 h-4 mr-2 text-brand-green" /> Visitor Counter & Public Analytics
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Visitor Baseline Count
              </label>
              <p className="text-[10px] text-gray-400 mb-1">
                The initial starting value for the public counter. Local browser visits will be added to this baseline.
              </p>
              <input
                type="number"
                value={config["visitor_baseline_count"] || "124830"}
                onChange={(e) =>
                  setConfig({ ...config, visitor_baseline_count: e.target.value })
                }
                className="w-full border p-2 rounded-lg"
                placeholder="124830"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Footer Visitor Bar Visibility
              </label>
              <p className="text-[10px] text-gray-400 mb-1">
                Configure whether to display the public visitor counter bar at the bottom of the webpage.
              </p>
              <select
                value={config["visitor_tracker_enabled"] || "true"}
                onChange={(e) =>
                  setConfig({ ...config, visitor_tracker_enabled: e.target.value })
                }
                className="w-full border p-2.5 rounded-lg bg-white"
              >
                <option value="true">Show Counter (Enabled)</option>
                <option value="false">Hide Counter (Disabled)</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const LegalManager = () => {
  const [tab, setTab] = useState("privacy_policy");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const TITLES: Record<string, string> = {
    privacy_policy: "Privacy Policy",
    terms_service: "Terms of Service",
    refund_policy: "Refund Policy",
  };
  useEffect(() => {
    const fetch = async () => {
      if (isSupabaseConfigured()) {
        const { data } = await supabase
          .from("system_settings")
          .select("value")
          .eq("key", tab)
          .single();
        if (data) setContent(data.value || "");
        else setContent("");
      }
    };
    fetch();
  }, [tab]);
  const save = async () => {
    setLoading(true);
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from("system_settings").upsert({
        key: tab,
        value: content,
        updated_at: new Date().toISOString(),
      });
      if (error) customAlert("Error: " + error.message);
      else customAlert("Saved!");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-blue">Legal Documents</h2>
        <button
          onClick={save}
          disabled={loading}
          className="bg-brand-blue text-white px-6 py-2 rounded-xl font-bold shadow-sm"
        >
          {loading ? "Saving..." : "Save Document"}
        </button>
      </div>
      <div className="flex space-x-2 border-b border-gray-200">
        {Object.keys(TITLES).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition ${tab === k ? "border-brand-blue text-brand-blue" : "border-transparent text-gray-500 hover:text-brand-blue"}`}
          >
            {TITLES[k]}
          </button>
        ))}
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
          HTML Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border p-4 rounded-xl font-mono text-sm h-[60vh] focus:ring-2 focus:ring-brand-blue/20 outline-none"
          placeholder="e.g., <h1>Privacy Policy</h1><p>Your privacy is important to us...</p>"
        />
      </div>
    </div>
  );
};

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, verifyOtp, requestOtp, user, resetPassword, updatePassword, logout } = useAuth();
  const [view, setView] = useState<"login" | "forgot" | "reset" | "otp">("login");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpType, setOtpType] = useState<'signup' | 'magiclink' | 'recovery'>("signup");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if we are in recovery mode from URL or session
    const hash = window.location.hash;
    if (hash.includes("type=recovery") || hash.includes("error_code=404")) {
      setView("reset");
    }
  }, [location]);

  useEffect(() => {
    if (user && view === "login") navigate("/admin/dashboard");
  }, [user, navigate, view]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await login(email, password);
    if (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const { error } = await resetPassword(email);
    if (error) {
      setError(error);
    } else {
      setSuccess("Password reset link has been sent to your email.");
    }
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");

    // Double check session before proceeding
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      setError(
        "Your recovery session has expired or is invalid. Please request a new reset link.",
      );
      setLoading(false);
      return;
    }

    const { error } = await updatePassword(password);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      setSuccess("Password updated successfully. You can now login.");
      await logout(); // Clear recovery session
      setTimeout(() => setView("login"), 2000);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await verifyOtp(email, otp, otpType);
    if (error) {
       setError(error);
       setLoading(false);
    } else {
       // Since verifyOtp logs us in automatically
       setSuccess("OTP verified! Redirecting...");
       // The redirect to dashboard will happen automatically in useEffect
    }
  };

  const handleRequestOtp = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    const { error } = await requestOtp(email);
    if (error) {
      setError(error);
    } else {
      setSuccess("OTP sent to your email!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-brand-light p-8 rounded-[2.5rem] shadow-skeuo-raised border border-white relative overflow-hidden transition-all duration-500">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-blue to-brand-green"></div>

        <div className="animate-fade-in relative">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-brand-light rounded-2xl shadow-skeuo-raised mx-auto flex items-center justify-center mb-4 border border-white">
              <Lock className="w-8 h-8 text-brand-blue" />
            </div>
            <h1 className="text-2xl font-serif-heading font-bold text-brand-blue">
              {view === "login"
                ? "Admin Portal"
                : view === "forgot"
                  ? "Reset Password"
                  : view === "otp"
                  ? "Enter Security Code"
                  : "New Password"}
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              {view === "login"
                ? "Secure access for authorized personnel only."
                : view === "forgot"
                  ? "Enter your email to receive a reset link."
                  : view === "otp"
                  ? "Check your email for the 6-digit OTP code."
                  : "Set a strong new password for your account."}
            </p>
          </div>

          {view === "login" && (
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-500 text-xs font-bold p-3 rounded-xl border border-red-100 flex items-center">
                  <X className="w-4 h-4 mr-2" /> {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 rounded-xl bg-brand-light shadow-skeuo-input outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium text-gray-700"
                  placeholder="admin@example.org"
                  required
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2 ml-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase flex-1">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setView("otp"); setOtpType("magiclink"); }}
                    className="text-brand-blue text-[10px] font-bold hover:underline ml-2"
                  >
                    Got an OTP?
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("forgot")}
                    className="text-brand-blue text-[10px] font-bold hover:underline ml-4"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 rounded-xl bg-brand-light shadow-skeuo-input outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium text-gray-700"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-blue text-white font-bold py-4 rounded-xl shadow-skeuo-raised hover:shadow-lg active:shadow-skeuo-pressed transition-all active:scale-95 disabled:opacity-70"
              >
                {loading ? "Authenticating..." : "Access Dashboard"}
              </button>
            </form>
          )}

          {view === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-500 text-xs font-bold p-3 rounded-xl border border-red-100 flex items-center">
                  <X className="w-4 h-4 mr-2" /> {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 text-green-600 text-xs font-bold p-3 rounded-xl border border-green-100 flex items-center">
                  <CircleCheck className="w-4 h-4 mr-2" /> {success}
                </div>
              )}
              <div>
                <div className="flex justify-between items-center mb-2 ml-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase">
                    Email Address
                  </label>
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    className="text-brand-blue text-[10px] font-bold hover:underline"
                  >
                    Request New OTP
                  </button>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 rounded-xl bg-brand-light shadow-skeuo-input outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium text-gray-700"
                  placeholder="admin@example.org"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-2">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-4 rounded-xl bg-brand-light shadow-skeuo-input outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium text-gray-700 font-mono tracking-widest text-center"
                  placeholder="123456"
                  required
                  maxLength={6}
                />
              </div>
              <div className="flex gap-4 mb-2 ml-2">
                  <label className="flex items-center space-x-2 text-xs font-bold text-gray-500">
                    <input type="radio" checked={otpType === 'signup'} onChange={() => setOtpType('signup')} />
                    <span>Signup</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-bold text-gray-500">
                    <input type="radio" checked={otpType === 'magiclink'} onChange={() => setOtpType('magiclink')} />
                    <span>Login (Magic Link)</span>
                  </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-blue text-white font-bold py-4 rounded-xl shadow-skeuo-raised hover:shadow-lg active:shadow-skeuo-pressed transition-all active:scale-95 disabled:opacity-70"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                type="button"
                onClick={() => setView("login")}
                className="w-full text-gray-400 text-xs font-bold hover:text-brand-blue transition"
              >
                Back to Login
              </button>
            </form>
          )}

          {view === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-500 text-xs font-bold p-3 rounded-xl border border-red-100 flex items-center">
                  <X className="w-4 h-4 mr-2" /> {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 text-green-600 text-xs font-bold p-3 rounded-xl border border-green-100 flex items-center">
                  <CircleCheck className="w-4 h-4 mr-2" /> {success}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 rounded-xl bg-brand-light shadow-skeuo-input outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium text-gray-700"
                  placeholder="admin@example.org"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-blue text-white font-bold py-4 rounded-xl shadow-skeuo-raised hover:shadow-lg active:shadow-skeuo-pressed transition-all active:scale-95 disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              <button
                type="button"
                onClick={() => setView("login")}
                className="w-full text-gray-400 text-xs font-bold hover:text-brand-blue transition"
              >
                Back to Login
              </button>
            </form>
          )}

          {view === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              {!user && (
                <div className="text-xs text-orange-500 font-bold p-3 bg-orange-50 rounded-xl border border-orange-100 flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying
                  recovery session...
                </div>
              )}
              {error && (
                <div className="bg-red-50 text-red-500 text-xs font-bold p-3 rounded-xl border border-red-100 flex items-center">
                  <X className="w-4 h-4 mr-2" /> {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 text-green-600 text-xs font-bold p-3 rounded-xl border border-green-100 flex items-center">
                  <CircleCheck className="w-4 h-4 mr-2" /> {success}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 rounded-xl bg-brand-light shadow-skeuo-input outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium text-gray-700"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-4 rounded-xl bg-brand-light shadow-skeuo-input outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium text-gray-700"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || !user}
                className="w-full bg-brand-blue text-white font-bold py-4 rounded-xl shadow-skeuo-raised hover:shadow-lg active:shadow-skeuo-pressed transition-all active:scale-95 disabled:opacity-70"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}

          <div className="mt-8 text-center flex flex-col gap-4">
            <Link
              to="/"
              className="text-gray-400 text-xs font-bold hover:text-brand-blue transition"
            >
              ← Back to Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const AccessDenied = ({ role }: { role: string | null }) => (
  <div className="flex flex-col items-center justify-center h-[50vh] text-center animate-fade-in">
    <div className="bg-red-50 p-6 rounded-full mb-6">
      <LockKeyhole className="w-12 h-12 text-red-500" />
    </div>
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Restricted</h2>
    <p className="text-gray-500 max-w-md mb-6">
      Your current role{" "}
      <strong>
        ({role ? ROLES_CONFIG[role as AdminRole]?.label : "Viewer"})
      </strong>{" "}
      does not have permission to view this section.
    </p>
    <button
      onClick={() => window.location.reload()}
      className="text-brand-blue font-bold hover:underline"
    >
      Refresh Permissions
    </button>
  </div>
);

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, logout, isSimulationMode } = useAuth();
  const [activeView, setActiveView] = useState<AdminView>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const adminRole = (profile?.role as AdminRole) || null;
  const loadingRole = false; // No longer needed as profile is in context

  const [confirmState, setConfirmState] = useState<{
    msg: string;
    resolve: (val: boolean) => void;
  } | null>(null);
  const [alertState, setAlertState] = useState<string | null>(null);

  useEffect(() => {
    globalConfirm = (msg: string) =>
      new Promise((resolve) => {
        setConfirmState({ msg, resolve });
      });
    globalAlert = (msg: string) => {
      setAlertState(msg);
    };
  }, []);

  useEffect(() => {
    if (user && user.email && window.location.href.includes("send_reset=true")) {
      const cleanUrl = window.location.href.replace("?send_reset=true", "").replace("&send_reset=true", "");
      window.history.replaceState(null, "", cleanUrl);

      supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: window.location.origin + "/admin/dashboard",
      }).then(({ error }) => {
        if (!error) {
          setTimeout(() => {
            globalAlert("Welcome! A password reset email has been sent to your inbox so you can set a secure password.");
          }, 1000); // Small delay to ensure alert takes precedence if others fire
        } else {
          console.error("Auto password reset error:", error);
        }
      });
    }
  }, [user]);

  // Define menu items with required permissions
  const MENU_ITEMS: {
    id: AdminView;
    label: string;
    icon: any;
    roles?: AdminRole[];
  }[] = [
    {
      id: "dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      roles: ["super_admin", "volunteer_manager", "viewer", "stakeholder"],
    },
    {
      id: "admin-users",
      label: "Admin & Stakeholders",
      icon: UserCog,
      roles: ["super_admin"],
    },
    {
      id: "settings",
      label: "Page Content",
      icon: Type,
      roles: ["super_admin", "viewer", "stakeholder"],
    },
    {
      id: "global-config",
      label: "Global Config",
      icon: Sliders,
      roles: ["super_admin"],
    },
    {
      id: "legal",
      label: "Legal Pages",
      icon: ScaleIcon,
      roles: ["super_admin"],
    },
    {
      id: "setup",
      label: "Backend Setup",
      icon: Database,
      roles: ["super_admin"],
    },

    // Content Managers & Super Admins
    {
      id: "mission",
      label: "Mission & Causes",
      icon: Target,
      roles: ["super_admin", "content_manager", "content_creator", "viewer", "stakeholder"],
    },
    {
      id: "impact",
      label: "Impact Manager",
      icon: Activity,
      roles: ["super_admin", "content_manager", "content_creator", "viewer", "stakeholder"],
    },
    {
      id: "blog",
      label: "Blog Posts",
      icon: FileText,
      roles: ["super_admin", "content_manager", "content_creator", "viewer", "stakeholder"],
    },
    {
      id: "gallery",
      label: "Gallery",
      icon: Image,
      roles: ["super_admin", "content_manager", "content_creator", "viewer", "stakeholder"],
    },
    {
      id: "team",
      label: "Team Members",
      icon: BriefcaseBusiness,
      roles: ["super_admin", "content_manager", "content_creator", "viewer", "stakeholder"],
    },
    {
      id: "testimonials",
      label: "Testimonials",
      icon: Quote,
      roles: ["super_admin", "content_manager", "content_creator", "viewer", "stakeholder"],
    },

    // Volunteer Managers & Super Admins
    {
      id: "donations",
      label: "Donations & Finance",
      icon: Banknote,
      roles: ["super_admin", "viewer", "stakeholder"],
    },
    {
      id: "volunteers",
      label: "Workforce",
      icon: UserPlus,
      roles: ["super_admin", "volunteer_manager", "viewer", "stakeholder"],
    },
    {
      id: "checklists",
      label: "Checklists",
      icon: CircleCheck,
      roles: ["super_admin", "volunteer_manager", "viewer", "stakeholder"],
    },
    {
      id: "partners",
      label: "Partnerships",
      icon: Handshake,
      roles: ["super_admin", "volunteer_manager", "viewer", "stakeholder"],
    },
    {
      id: "newsletter",
      label: "Newsletter",
      icon: Newspaper,
      roles: ["super_admin", "volunteer_manager", "viewer", "stakeholder"],
    },
    {
      id: "funds",
      label: "Donation Funds",
      icon: Wallet,
      roles: ["super_admin", "volunteer_manager", "viewer", "stakeholder"],
    },
    {
      id: "announcements",
      label: "Announcement Bar",
      icon: Megaphone,
      roles: ["super_admin", "content_manager", "content_creator", "viewer", "stakeholder"],
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/admin");
  };

  const isAllowed = (itemRoles?: AdminRole[]) => {
    if (!itemRoles) return true; // Public to all admins
    if (!adminRole) return false;
    return itemRoles.includes(adminRole);
  };

  // Filter menu items based on role
  const visibleMenuItems = MENU_ITEMS.filter((item) => isAllowed(item.roles));

  // Determine if current view is allowed
  const currentViewConfig = MENU_ITEMS.find((i) => i.id === activeView);
  const accessDenied = currentViewConfig && !isAllowed(currentViewConfig.roles);

  return (
    <div className="min-h-screen bg-brand-light flex">
      <aside
        className={`${isSidebarOpen ? "w-64" : "w-20"} bg-brand-blue text-white transition-all duration-300 sticky top-0 h-screen flex flex-col z-20 shadow-xl`}
      >
        <div className="p-6 flex items-center justify-between border-b border-blue-800/30">
          {isSidebarOpen && (
            <span className="font-serif-heading font-bold text-xl tracking-tight">
              Bennu Admin
            </span>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <LayoutDashboard className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group ${activeView === item.id ? "bg-white/10 text-white shadow-lg" : "text-blue-200 hover:bg-white/5 hover:text-white"}`}
                title={!isSidebarOpen ? item.label : ""}
              >
                <Icon
                  className={`w-5 h-5 ${!isSidebarOpen ? "mx-auto" : "mr-3"}`}
                />
                {isSidebarOpen && (
                  <span className="font-bold text-sm tracking-wide">
                    {item.label}
                  </span>
                )}
                {isSidebarOpen && activeView === item.id && (
                  <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-blue-800/30">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 text-red-300 hover:bg-red-500/10 hover:text-red-200 ${!isSidebarOpen ? "justify-center" : ""}`}
            title="Logout"
          >
            <LogOut className={`w-5 h-5 ${!isSidebarOpen ? "" : "mr-3"}`} />
            {isSidebarOpen && (
              <span className="font-bold text-sm">Sign Out</span>
            )}
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto h-screen scroll-smooth">
        <header className="flex justify-between items-center mb-10 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-serif-heading font-bold text-brand-blue mb-2">
              {MENU_ITEMS.find((i) => i.id === activeView)?.label}
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              Manage your organization's digital presence.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-brand-blue transition bg-white rounded-full shadow-sm hover:shadow-md relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right hidden md:block">
                <div className="text-sm font-bold text-gray-800">
                  {user?.email}
                </div>
                <div className="text-xs text-brand-green font-bold uppercase">
                  {adminRole ? ROLES_CONFIG[adminRole]?.label : "Viewer"}
                </div>
              </div>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-brand-blue font-bold border border-blue-100">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {loadingRole ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin w-8 h-8 text-brand-blue" />
          </div>
        ) : accessDenied ? (
          <AccessDenied role={adminRole} />
        ) : (
          <div className="animate-fade-in">
            <PermissionBanner role={adminRole} />
            {activeView === "dashboard" && <OverviewStats />}
            {activeView === "admin-users" && <AdminUsersManager />}
            {activeView === "donations" && <DonationsManager />}
            {activeView === "volunteers" && <VolunteersManager />}
            {activeView === "checklists" && <ChecklistManager />}
            {activeView === "partners" && <PartnersManager />}
            {activeView === "newsletter" && <NewsletterManager />}
            {activeView === "impact" && (
              <ImpactManager
                userRole={adminRole}
                userEmail={user?.email}
                userId={user?.id}
              />
            )}
            {activeView === "blog" && (
              <BlogManager
                userRole={adminRole}
                userEmail={user?.email}
                userId={user?.id}
              />
            )}
            {activeView === "gallery" && (
              <GalleryManager
                userRole={adminRole}
                userEmail={user?.email}
                userId={user?.id}
              />
            )}
            {activeView === "team" && (
              <TeamManager
                userRole={adminRole}
                userEmail={user?.email}
                userId={user?.id}
              />
            )}
            {activeView === "testimonials" && (
              <TestimonialsManager
                userRole={adminRole}
                userEmail={user?.email}
                userId={user?.id}
              />
            )}
            {activeView === "setup" && <BackendSetupView />}
            {activeView === "funds" && <FundsManager />}
            {activeView === "announcements" && <AnnouncementsManager />}
            {activeView === "mission" && (
              <MissionManager
                userRole={adminRole}
                userEmail={user?.email}
                userId={user?.id}
              />
            )}
            {activeView === "settings" && <SettingsView />}
            {activeView === "global-config" && <GlobalConfigManager />}
            {activeView === "legal" && <LegalManager />}
          </div>
        )}

        {confirmState && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-up border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-2">
                Confirm Action
              </h3>
              <p className="text-gray-600 mb-6">{confirmState.msg}</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    confirmState.resolve(false);
                    setConfirmState(null);
                  }}
                  className="px-4 py-2 rounded-lg font-bold text-gray-600 bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    confirmState.resolve(true);
                    setConfirmState(null);
                  }}
                  className="px-4 py-2 rounded-lg font-bold text-white bg-red-500 hover:bg-red-600"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        {alertState && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-up border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-2">
                Notification
              </h3>
              <p className="text-gray-600 mb-6">{alertState}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setAlertState(null)}
                  className="px-4 py-2 rounded-lg font-bold text-white bg-brand-blue hover:bg-blue-700"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
