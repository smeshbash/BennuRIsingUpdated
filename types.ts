

export type DonationFrequency = 'monthly' | 'once';

export interface DonationTier {
  amount: number;
  label: string; // e.g. "Educate a Child"
}

export interface DonationFund {
  id: string;
  name: string;
  is_active?: boolean;
}

export interface DonorDetails {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pan?: string; // Required for 80G Tax Exemption in India
}

export interface ImpactStory {
  id: number;
  image: string;
  title: string;
  description: string;
  author: string;
  location?: string;
}

export interface NavItem {
  label: string;
  path: string;
  subsections?: { label: string, hash: string }[];
}

export interface SocialLink {
  platform: 'facebook' | 'twitter' | 'instagram' | 'youtube' | 'linkedin';
  url: string;
}

export interface Album {
  id: string;
  title: string;
  cover: string;
  count: number;
  images: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface ImpactStat {
  label: string;
  value: string;
  desc: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  date: string;
  image: string;
  category: string;
}

export interface Testimonial {
  id?: number;
  name: string;
  role: string;
  text?: string;
  content?: string;
}

export interface MissionGroup {
  id: number;
  title: string;
  description: string;
  color: string; // e.g. "text-brand-red"
  icon: string; // Lucide icon name
  display_order: number;
}

export interface MissionCause {
  id: number;
  group_id: number;
  title: string;
  desc: string;
  icon: string;
}