import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { filterJobs, jobsQueryOptions } from "@/services/jobs";
import { AppShell } from "@/components/layout/AppShell";
import { JobCard } from "@/features/jobs/JobCard";
import { EmptyState } from "@/components/common/Chip";
import { useAppState } from "@/features/app/AppState";
import { JobsError } from "@/features/jobs/JobsError";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { type: "All" | "Internship" | "Full-time" | "Contract" } => ({ type: search.type === "Internship" || search.type === "Full-time" || search.type === "Contract" ? search.type : "All" }),
  loader: ({ context }) => context.queryClient.ensureQueryData(jobsQueryOptions),
  errorComponent: JobsError,
  notFoundComponent: JobsError,
  pendingComponent: () => <AppShell title="Today's leads"><div className="h-64 animate-pulse rounded-2xl bg-muted" /></AppShell>,
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
  const { type } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data } = useSuspenseQuery(jobsQueryOptions);
  const jobs = filterJobs(data, { query: search, type });

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
          <Button variant="outline" key={t} onClick={() => { void navigate({ search: { type: t } }); }}
            className={cn("shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition", t === type ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground")}>
            {t}
          </Button>
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
