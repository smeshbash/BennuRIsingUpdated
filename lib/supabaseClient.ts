import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Missing Supabase environment variables. Please check your .env file.');
}

// Provide placeholder values to prevent the app from crashing on startup if env vars are missing
export const supabase = createClient(
    SUPABASE_URL || 'https://placeholder.supabase.co', 
    SUPABASE_ANON_KEY || 'placeholder',
    {
        auth: {
            storageKey: 'bennu_auth_token_v2',
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false
        }
    }
);

export const supabaseAnon = createClient(
    SUPABASE_URL || 'https://placeholder.supabase.co', 
    SUPABASE_ANON_KEY || 'placeholder',
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
        }
    }
);

export const isSupabaseConfigured = () => {
    return !!SUPABASE_URL && !!SUPABASE_ANON_KEY && SUPABASE_URL !== 'undefined' && SUPABASE_URL !== 'null' && SUPABASE_URL.trim() !== '';
};

export const testSupabaseConnection = async () => {
    try {
        const { error } = await supabase.from('profiles').select('id').limit(1);
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Supabase connection test failed:', error);
        return { success: false, error };
    }
};

export const configureSupabase = () => {
    console.log("Supabase configuration is handled via environment variables.");
};

export const disconnectSupabase = () => {
    if (typeof window !== 'undefined') {
        window.location.reload();
    }
};