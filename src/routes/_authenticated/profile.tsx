import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Mail } from "lucide-react";
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import type { User } from '@/types';
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
  const { user, saved, applications, loading, updateProfile } = useAppState();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  if (loading) return <AppShell title="Profile"><div className="h-64 animate-pulse rounded-2xl bg-muted" /></AppShell>;
  if (!user) return <AppShell title="Profile"><EmptyState title="You're signed out" body="Log in to see your profile." action={<Link to="/login" className="text-sm font-medium text-stamp">Log in</Link>} /></AppShell>;
  return (
    <AppShell title="Profile">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
        <div className="h-24 bg-primary" />
        <div className="p-6 pt-0">
          <div className="-mt-10 grid size-20 place-items-center rounded-2xl border-4 border-card bg-stamp font-display text-2xl text-primary-foreground">
            {user.name.split(" ").map((p) => p[0]).join("")}
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <h2 className="text-2xl">{user.name}</h2>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button variant="outline">Edit profile</Button></DialogTrigger>
              <DialogContent>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>Your name, headline, location and skills.</DialogDescription>
                <form className="space-y-4" onSubmit={async (event: FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  const form = new FormData(event.currentTarget);
                  const profile: User = { ...user, name: String(form.get('name') ?? '').trim(), headline: String(form.get('headline') ?? '').trim(), location: String(form.get('location') ?? '').trim(), skills: String(form.get('skills') ?? '').split(',').map((s) => s.trim()).filter(Boolean) };
                  setPending(true);
                  if (await updateProfile(profile)) setOpen(false);
                  setPending(false);
                }}>
                  {(['name', 'headline', 'location', 'skills'] as const).map((field) => <label key={field} className="block text-sm capitalize">{field}<input name={field} required={field === 'name'} defaultValue={field === 'skills' ? user.skills.join(', ') : user[field]} className="mt-1 h-11 w-full rounded-xl border bg-card px-4 text-sm outline-none focus:border-stamp" /></label>)}
                  <Button type="submit" disabled={pending}>{pending ? 'Saving…' : 'Save profile'}</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
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
