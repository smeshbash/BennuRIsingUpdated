import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface Announcement {
  id: number;
  message: string;
  label: string | null;
  link_url: string | null;
}

// Tag chip color mapping — kept intentionally small (NEW / URGENT / EVENT)
// per the admin-facing dropdown in AdminPages.tsx. Any other/unknown label
// value still renders, just with a neutral chip style, so a bad value never
// hides the announcement outright.
const LABEL_STYLES: Record<string, string> = {
  NEW: 'bg-brand-green text-white',
  URGENT: 'bg-brand-red text-white',
  EVENT: 'bg-amber-400 text-brand-dark',
};

export const AnnouncementBar: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('announcements')
            .select('id, message, label, link_url')
            .eq('is_active', true)
            .eq('is_deleted', false)
            .order('display_order', { ascending: true });

          if (!error && data) {
            setAnnouncements(data);
          }
        } catch (err) {
          console.error('Failed to load announcements:', err);
        }
      }
      setLoading(false);
    };
    fetchAnnouncements();
  }, []);

  // Nothing to show — render nothing at all rather than an empty strip.
  if (loading || announcements.length === 0) {
    return null;
  }

  // Duplicated for a seamless marquee loop, same pattern as the homepage
  // testimonials marquee (see pages/Home.tsx).
  const marqueeContent = [...announcements, ...announcements];

  const renderItem = (item: Announcement, key: string) => {
    const content = (
      <div className="flex items-center gap-2 whitespace-nowrap">
        {item.label && (
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
              LABEL_STYLES[item.label] || 'bg-white/20 text-white'
            }`}
          >
            {item.label}
          </span>
        )}
        <span className="text-white/90 text-sm font-medium">{item.message}</span>
      </div>
    );

    return item.link_url ? (
      <a
        key={key}
        href={item.link_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mx-8 hover:opacity-80 transition-opacity"
      >
        {content}
      </a>
    ) : (
      <div key={key} className="mx-8">
        {content}
      </div>
    );
  };

  return (
    <div className="w-full bg-brand-dark overflow-hidden relative border-b border-white/10">
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-brand-dark to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-brand-dark to-transparent z-10 pointer-events-none"></div>
      {/* Reversed relative to the testimonials marquee (which scrolls
          left-to-right) so the two ticker effects on the page move in
          opposite directions rather than feeling like duplicates. */}
      <div className="flex w-max animate-marquee-reverse hover:pause py-2">
        {marqueeContent.map((item, i) => renderItem(item, `${item.id}-${i}`))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
