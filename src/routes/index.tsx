import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Job } from "@/types";
import { listJobs } from "@/services/jobs";
import { AppShell } from "@/components/layout/AppShell";
import { JobCard } from "@/features/jobs/JobCard";
import { EmptyState } from "@/components/common/Chip";
import { useAppState } from "@/features/app/AppState";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Feed — Chitthi" },
      { name: "description", content: "Fresh internships and early-career job leads in one clean feed." },
      { property: "og:title", content: "Chitthi — Job leads, delivered" },
      { property: "og:description", content: "Fresh internships and early-career job leads in one clean feed." },
    ],
  }),
  component: Feed,
});

const types = ["All", "Internship", "Full-time", "Contract"] as const;

function Feed() {
  const { search, saved, applications } = useAppState();
  const [type, setType] = useState<(typeof types)[number]>("All");
  const [jobs, setJobs] = useState<Job[] | null>(null);

  useEffect(() => {
    let live = true;
    listJobs({ query: search, type }).then((j) => live && setJobs(j));
    return () => { live = false; };
  }, [search, type]);

  const aside = (
    <div className="sticky top-24 space-y-4">
      <div className="rounded-2xl border bg-card p-5 shadow-card">
        <p className="font-display text-lg">Your week</p>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <Stat label="Saved" value={saved.size} />
          <Stat label="Applied" value={applications.filter((a) => a.status !== "Saved").length} />
        </dl>
      </div>
      <div className="rounded-2xl stamp-edge bg-stamp-soft p-5 text-sm">
        <p className="font-display text-lg">Tip</p>
        <p className="mt-1 text-muted-foreground">Apply within 48 hours of a post — early applicants are seen first.</p>
      </div>
    </div>
  );

  return (
    <AppShell title="Today's leads" subtitle="Fresh openings gathered for you." aside={aside}>
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {types.map((t) => (
          <button key={t} onClick={() => setType(t)}
            className={cn("shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition", t === type ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground")}>
            {t}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {jobs === null
          ? [0, 1].map((i) => <div key={i} className="h-64 animate-pulse rounded-2xl bg-muted" />)
          : jobs.length === 0
            ? <EmptyState title="No matches" body="Try a different search term or filter." />
            : jobs.map((j) => <JobCard key={j.id} job={j} />)}
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-secondary p-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-display text-2xl">{value}</dd>
    </div>
  );
}
