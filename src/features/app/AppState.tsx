// Frontend-only app state (mock auth, saved jobs, applications). NOT secure — demo only.
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Application, ApplicationStatus, User } from "@/types";
import { mockUser } from "@/mocks/jobs";

interface AppState {
  user: User | null;
  signIn: (email: string) => void;
  signOut: () => void;
  search: string;
  setSearch: (q: string) => void;
  saved: Set<string>;
  toggleSaved: (id: string) => void;
  applications: Application[];
  setStatus: (jobId: string, status: ApplicationStatus) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUser);
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState<Set<string>>(new Set(["j2", "j4"]));
  const [applications, setApplications] = useState<Application[]>([
    { jobId: "j2", status: "Interview", updatedAt: new Date().toISOString() },
    { jobId: "j3", status: "Applied", updatedAt: new Date().toISOString() },
    { jobId: "j5", status: "Rejected", updatedAt: new Date().toISOString() },
  ]);

  const value: AppState = {
    user,
    signIn: (email) => setUser({ ...mockUser, email: email || mockUser.email }),
    signOut: () => setUser(null),
    search,
    setSearch,
    saved,
    toggleSaved: (id) =>
      setSaved((s) => {
        const n = new Set(s);
        n.has(id) ? n.delete(id) : n.add(id);
        return n;
      }),
    applications,
    setStatus: (jobId, status) =>
      setApplications((list) => {
        const rest = list.filter((a) => a.jobId !== jobId);
        return [...rest, { jobId, status, updatedAt: new Date().toISOString() }];
      }),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAppState must be used inside AppStateProvider");
  return c;
}
