import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { Switch } from "@/components/ui/switch";
import { useAppState } from "@/features/app/AppState";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Settings — Chitthi" },
      { name: "description", content: "Notification and feed preferences for Chitthi." },
      { property: "og:title", content: "Settings — Chitthi" },
      { property: "og:description", content: "Notification and feed preferences for Chitthi." },
    ],
  }),
  component: Settings,
});

const prefs = [
  { id: "digest", label: "Daily email digest", hint: "A morning summary of new leads.", on: true },
  { id: "intern", label: "Prioritise internships", hint: "Show internship posts first in your feed.", on: true },
  { id: "remote", label: "Remote roles only", hint: "Hide on-site and hybrid openings.", on: false },
];

function Settings() {
  const { signOut } = useAppState();
  return (
    <AppShell title="Settings" subtitle="Preferences are stored for this session only (demo).">
      <div className="divide-y rounded-2xl border bg-card shadow-card">
        {prefs.map((p) => (
          <label key={p.id} className="flex items-center justify-between gap-4 p-5">
            <span><span className="block font-medium">{p.label}</span><span className="text-sm text-muted-foreground">{p.hint}</span></span>
            <Switch defaultChecked={p.on} onCheckedChange={() => toast("Preference updated")} />
          </label>
        ))}
      </div>
      <Button variant="outline" onClick={() => { void signOut(); }}
        className="mt-6 rounded-full border border-destructive/40 px-5 py-2 text-sm font-medium text-destructive hover:bg-stamp-soft">
        Log out
      </Button>
    </AppShell>
  );
}
