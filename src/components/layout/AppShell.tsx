import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Bookmark, Home, KanbanSquare, Search, Settings, User, Bell } from "lucide-react";
import { useAppState } from "@/features/app/AppState";
import { Logo } from "@/components/common/Logo";

const nav = [
  { to: "/", label: "Feed", icon: Home },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/tracker", label: "Tracker", icon: KanbanSquare },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ title, subtitle, children, aside }: { title: string; subtitle?: string; children: ReactNode; aside?: ReactNode }) {
  const { search, setSearch, user } = useAppState();
  return (
    <div className="min-h-screen paper-grain">
      {/* Left rail: icons on tablet, full labels on desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-20 flex-col border-r bg-sidebar/90 backdrop-blur md:flex lg:w-60">
        <div className="flex h-16 items-center px-5"><Logo compactOnTablet /></div>
        <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} activeOptions={{ exact: true }}
              className="group flex items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-sidebar-accent hover:text-foreground lg:justify-start data-[status=active]:bg-primary data-[status=active]:text-primary-foreground">
              <Icon className="size-5 shrink-0" /><span className="hidden lg:inline">{label}</span>
            </Link>
          ))}
        </nav>
        <div className="hidden m-3 rounded-xl stamp-edge bg-stamp-soft p-4 text-xs text-foreground lg:block">
          <p className="font-display text-base">New leads daily</p>
          <p className="mt-1 text-muted-foreground">Demo data — live aggregation comes later.</p>
        </div>
      </aside>

      <div className="md:pl-20 lg:pl-60">
        <header className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
            <div className="md:hidden"><Logo /></div>
            <label className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search roles, companies, skills…"
                className="h-10 w-full rounded-full border bg-card pl-9 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-stamp focus:ring-2 focus:ring-ring/20" />
            </label>
            <button aria-label="Notifications" className="relative grid size-10 place-items-center rounded-full border bg-card text-muted-foreground hover:text-foreground">
              <Bell className="size-4" /><span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-stamp" />
            </button>
            {user ? (
              <Link to="/profile" className="grid size-10 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {user.name.split(" ").map((p) => p[0]).join("")}
              </Link>
            ) : (
              <Link to="/login" className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Log in</Link>
            )}
          </div>
        </header>

        <main className="mx-auto grid max-w-6xl gap-8 px-4 pb-28 pt-8 sm:px-6 md:pb-12 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl">{title}</h1>
              {subtitle && <p className="mt-1.5 text-muted-foreground">{subtitle}</p>}
            </div>
            {children}
          </div>
          {aside && <div className="hidden xl:block">{aside}</div>}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-3 bottom-3 z-30 flex justify-around rounded-2xl border bg-card/95 p-1.5 shadow-lift backdrop-blur md:hidden">
        {nav.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} activeOptions={{ exact: true }}
            className="flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[11px] font-medium text-muted-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground">
            <Icon className="size-5" />{label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
