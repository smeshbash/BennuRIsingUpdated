import { supabase, isSupabaseConfigured } from './supabaseClient';

// Several components (Header, Footer, VisitorCountBar, Home, DonationWidget)
// each independently query system_settings for their own slice of config —
// on the homepage this meant 5 near-simultaneous requests to the same table,
// all competing for Supabase's connection pool. Measured impact: each of
// those calls stretched to 3-5 seconds under that contention, vs. ~300-600ms
// for a single request in isolation.
//
// This module fetches the whole table ONCE per page load and shares the
// result (as an in-flight promise, so even calls that start before the first
// one resolves still just await the same request) instead of every component
// firing its own `key IN (...)` query. Returns the same {key, value}[] row
// shape Supabase itself returns, so existing `data.find(d => d.key === 'x')`
// call sites don't need to change — only the fetch call itself does.
type SettingRow = { key: string; value: any };

let cachedPromise: Promise<SettingRow[]> | null = null;

export const getAllSystemSettings = (): Promise<SettingRow[]> => {
  if (!isSupabaseConfigured()) return Promise.resolve([]);
  if (!cachedPromise) {
    // Wrapped in Promise.resolve(...) because Supabase's query builder returns a
    // thenable (PromiseLike), not a real Promise — doesn't satisfy Promise<T>
    // on its own (no .catch()/.finally()), which cachedPromise's type needs.
    cachedPromise = Promise.resolve(
      supabase
        .from('system_settings')
        .select('key, value')
        .then(({ data, error }) => {
          if (error || !data) {
            cachedPromise = null; // don't poison the cache with a failed fetch — allow retry
            return [];
          }
          return data as SettingRow[];
        })
    );
  }
  return cachedPromise;
};

// For call sites that write to system_settings (e.g. VisitorCountBar upserting
// visitor_baseline_count) and need subsequent reads — in this page load or a
// future one via a fresh mount — to see the new value instead of stale cache.
export const invalidateSystemSettingsCache = () => {
  cachedPromise = null;
};
