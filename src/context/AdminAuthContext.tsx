import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

type AdminContextValue = {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdmin = useCallback(async (uid: string) => {
    const { data, error } = await supabase
      .from('admins')
      .select('admin_id')
      .eq('user_id', uid)
      .maybeSingle();

    if (error) {
      console.error('Admin check error:', error.message);
      setIsAdmin(false);
      return;
    }
    setIsAdmin(!!data);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        checkAdmin(s.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        checkAdmin(s.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [checkAdmin]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message === 'Invalid login credentials' ? 'Invalid admin credentials.' : error.message };
    }

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return { error: 'Authentication failed.' };
    }

    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('admin_id')
      .eq('user_id', userData.user.id)
      .maybeSingle();

    if (adminError || !adminData) {
      await supabase.auth.signOut();
      return { error: 'You do not have admin access.' };
    }

    setIsAdmin(true);
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  }, []);

  return (
    <AdminContext.Provider value={{ session, user, isAdmin, loading, signIn, signOut }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
