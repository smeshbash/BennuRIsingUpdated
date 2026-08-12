

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface AuthContextType {
  user: any | null;
  profile: any | null;
  verifyOtp: (email: string, token: string, type: 'signup' | 'magiclink' | 'recovery') => Promise<{ error: string | null }>;
  requestOtp: (email: string) => Promise<{ error: string | null }>;
  login: (email: string, pass: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPass: string) => Promise<{ error: string | null }>;
  isLoading: boolean;
  isSimulationMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fix: Make children optional to resolve TypeScript error
export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the URL is the placeholder one to enable simulation mode
  // We check the internal property to see if it matches our placeholder
  const isSimulationMode = !isSupabaseConfigured();

  useEffect(() => {
    // Check for existing session on load
    if (isSimulationMode) {
       setIsLoading(false);
    } else {
       // Manual Hash Parsing for HashRouter compatibility
       const handleHashSession = async () => {
          const hash = window.location.hash;
          if (hash.includes('access_token=') && (hash.includes('type=recovery') || hash.includes('type=signup') || hash.includes('type=invite'))) {
              const hashParams = new URLSearchParams(hash.split('#').pop() || '');
              const access_token = hashParams.get('access_token');
              const refresh_token = hashParams.get('refresh_token');

              if (access_token && refresh_token) {
                  const { data, error } = await supabase.auth.setSession({
                      access_token,
                      refresh_token,
                  });
                  if (data?.session) {
                      // Clear the token fragments from the URL so it's not reused on reload
                      const cleanHash = window.location.hash.split('#access_token=')[0];
                      window.history.replaceState(null, document.title, window.location.pathname + window.location.search + cleanHash);
                      setUser(data.session.user);
                      // Force a profile refresh
                      const { data: prof } = await supabase.from('profiles').select('*').neq('is_deleted', true).eq('id', data.session.user.id).single();
                      setProfile(prof || null);
                  }
                  if (error) {
                      const isRefreshTokenError = error.message.includes('Refresh Token Not Found') || error.message.includes('Invalid Refresh Token');
                      if (!isRefreshTokenError) {
                          console.error("Manual Session Error:", error);
                      }
                      // If it's a token error, also clear the URL to avoid retry loop
                      if (isRefreshTokenError) {
                           const cleanHash = window.location.hash.split('#access_token=')[0].split('&access_token=')[0]; // in case it was appended differently
                           window.history.replaceState(null, document.title, window.location.pathname + window.location.search + cleanHash);
                      }
                  }
              }
          }
       };

       handleHashSession();

       // Real Supabase Session Check
       supabase.auth.getSession().then(async ({ data, error }) => {
          if (error) {
             const isRefreshTokenError = error.message.includes('Refresh Token Not Found') || error.message.includes('Invalid Refresh Token');
             if (!isRefreshTokenError) {
                 console.error("Session Check Error:", error);
             }
             if (isRefreshTokenError) {
                 await supabase.auth.signOut().catch(() => {});
             }
          }
          setUser(data?.session?.user ?? null);
          setIsLoading(false);
       }).catch(async err => {
           const isRefreshTokenError = err.message && (err.message.includes('Refresh Token') || err.message.includes('refresh_token'));
           if (!isRefreshTokenError) {
               console.error("Auth Init Error:", err);
           }
           if (isRefreshTokenError) {
               await supabase.auth.signOut().catch(() => {});
           }
           setIsLoading(false);
       });

       const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          setUser(session?.user ?? null);
          if (event === 'PASSWORD_RECOVERY') {
              // This is handled in the UI by checking the session/user
              console.log("Password recovery mode active");
          }
       });

       return () => subscription.unsubscribe();
    }
  }, [isSimulationMode]);

  const verifyOtp = async (email: string, token: string, type: 'signup' | 'magiclink' | 'recovery') => {
    if (isSimulationMode) return { error: 'Simulation mode disabled' };
    const { error } = await supabase.auth.verifyOtp({ email, token, type });
    return { error: error?.message || null };
  };

  const requestOtp = async (email: string) => {
    if (isSimulationMode) return { error: 'Simulation mode disabled' };
    const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: { shouldCreateUser: false } // only existing users
    });
    return { error: error?.message || null };
  };

  const login = async (email: string, pass: string) => {
    if (isSimulationMode) {
        return { error: 'Simulation mode login is disabled. Please configure Supabase environment variables.' };
    } else {
        // REAL SUPABASE LOGIN
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password: pass,
        });
        return { error: error?.message || null };
    }
  };

  const logout = async () => {
    if (isSimulationMode) {
        setUser(null);
    } else {
        await supabase.auth.signOut();
    }
  };

  const resetPassword = async (email: string) => {
    if (isSimulationMode) return { error: 'Simulation mode disabled' };
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#/admin/dashboard`,
    });
    return { error: error?.message || null };
  };

  const updatePassword = async (newPass: string) => {
    if (isSimulationMode) return { error: 'Simulation mode disabled' };
    const { error } = await supabase.auth.updateUser({ password: newPass });
    return { error: error?.message || null };
  };

  useEffect(() => {
    if (user && !isSimulationMode) {
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          setProfile(data || null);
        });
    } else {
      setProfile(null);
    }
  }, [user, isSimulationMode]);

  return (
    <AuthContext.Provider value={{ user, profile, verifyOtp, requestOtp, login, logout, resetPassword, updatePassword, isLoading, isSimulationMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};