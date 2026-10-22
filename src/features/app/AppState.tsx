import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { currentAccount, readAccount, writeSaved, writeStatus, writeProfile } from '@/services/account';
import type { Application, ApplicationStatus, User } from "@/types";

interface AppState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  search: string;
  setSearch: (q: string) => void;
  saved: Set<string>;
  toggleSaved: (id: string) => Promise<boolean>;
  applications: Application[];
  setStatus: (jobId: string, status: ApplicationStatus) => Promise<boolean>;
  updateProfile: (profile: User) => Promise<boolean>;
}
const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [applications, setApplications] = useState<Application[]>([]);
  const queryClient = useQueryClient();
  const router = useRouter();
  const navigate = useNavigate();
  const generation = useRef(0);
  const busy = useRef(new Set<string>());
  useEffect(() => {
    let live = true;
    const refresh = async () => {
      const version = ++generation.current;
      setLoading(true);
      setUser(null); setSaved(new Set()); setApplications([]);
      try {
        const account = await currentAccount();
        if (!account) return;
        const state = await readAccount(account.id, account.email ?? '');
        if (live && version === generation.current) {
          setUser(state.user); setSaved(state.saved); setApplications(state.applications);
        }
      } catch { if (live) toast.error('Your account couldn’t load. Please try again.'); }
      finally { if (live && version === generation.current) setLoading(false); }
    };
    // One app-wide subscriber, deferred to avoid Auth callback lock contention.
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (!['SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED'].includes(event)) return;
      if (event === 'SIGNED_OUT') {
        ++generation.current;
        setUser(null); setSaved(new Set()); setApplications([]); setLoading(false);
        void navigate({ to: '/login', replace: true });
      } else {
        setTimeout(() => { if (live) void refresh(); }, 0);
        void queryClient.invalidateQueries();
      }
      void router.invalidate();
    });
    void refresh();
    return () => { live = false; ++generation.current; data.subscription.unsubscribe(); };
  }, [queryClient, router, navigate]);

  const value: AppState = {
    user, loading, search, setSearch, saved, applications,
    signIn: async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    signUp: async (email, password, name) => {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name }, emailRedirectTo: window.location.origin } });
      if (error) throw error;
      return Boolean(data.session);
    },
    signOut: async () => {
      await queryClient.cancelQueries(); queryClient.clear();
      const { error } = await supabase.auth.signOut();
      if (error) { toast.error('Log out failed. Please try again.'); return; }
      ++generation.current; setUser(null); setSaved(new Set()); setApplications([]); setSearch('');
      await navigate({ to: '/login', replace: true });
    },
    toggleSaved: async (id) => {
      if (!user) { toast('Log in to save leads.'); return false; }
      if (busy.current.has(id)) return false;
      busy.current.add(id);
      const version = generation.current;
      try {
        await writeSaved(user.id, id, saved.has(id));
        if (version !== generation.current) return false;
        setSaved((previous) => { const next = new Set(previous); next.has(id) ? next.delete(id) : next.add(id); return next; });
        return true;
      } catch (error) { toast.error(error instanceof Error ? error.message : 'Couldn’t save this lead.'); return false; }
      finally { busy.current.delete(id); }
    },
    setStatus: async (jobId, status) => {
      if (!user) { toast('Log in to track applications.'); return false; }
      const version = generation.current;
      try {
        await writeStatus(user.id, jobId, status);
        if (version !== generation.current) return false;
        setApplications((list) => [...list.filter((a) => a.jobId !== jobId), { jobId, status, updatedAt: new Date().toISOString() }]);
        return true;
      } catch (error) { toast.error(error instanceof Error ? error.message : 'Couldn’t update this application.'); return false; }
    },
    updateProfile: async (profile) => {
      if (!user || profile.id !== user.id) return false;
      const version = generation.current;
      try { await writeProfile(profile); if (version !== generation.current) return false; setUser(profile); toast.success('Profile saved'); return true; }
      catch (error) { toast.error(error instanceof Error ? error.message : 'Couldn’t save your profile.'); return false; }
    },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useAppState() {
  const context = useContext(Ctx);
  if (!context) throw new Error('useAppState must be used inside AppStateProvider');
  return context;
}
