import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Mail } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Chip, EmptyState } from "@/components/common/Chip";
import { useAppState } from "@/features/app/AppState";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Profile — Chitthi" },
      { name: "description", content: "Your Chitthi profile, skills and preferences." },
      { property: "og:title", content: "Profile — Chitthi" },
      { property: "og:description", content: "Your Chitthi profile, skills and preferences." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { user, saved, applications } = useAppState();
  if (!user) return <AppShell title="Profile"><EmptyState title="You're signed out" body="Log in to see your profile." action={<Link to="/login" className="text-sm font-medium text-stamp">Log in</Link>} /></AppShell>;
  return (
    <AppShell title="Profile">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
        <div className="h-24 bg-primary" />
        <div className="p-6 pt-0">
          <div className="-mt-10 grid size-20 place-items-center rounded-2xl border-4 border-card bg-stamp font-display text-2xl text-primary-foreground">
            {user.name.split(" ").map((p) => p[0]).join("")}
          </div>
          <h2 className="mt-3 text-2xl">{user.name}</h2>
          <p className="text-muted-foreground">{user.headline}</p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="size-4" />{user.location}</span>
            <span className="inline-flex items-center gap-1"><Mail className="size-4" />{user.email}</span>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">{user.skills.map((s) => <Chip key={s} tone="accent">{s}</Chip>)}</div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-sm">
            <div className="rounded-xl bg-secondary p-3"><p className="text-sm text-muted-foreground">Saved</p><p className="font-display text-2xl">{saved.size}</p></div>
            <div className="rounded-xl bg-secondary p-3"><p className="text-sm text-muted-foreground">Applications</p><p className="font-display text-2xl">{applications.length}</p></div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
