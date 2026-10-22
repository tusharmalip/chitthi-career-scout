import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { JobCard } from "@/features/jobs/JobCard";
import { EmptyState } from "@/components/common/Chip";
import { useAppState } from "@/features/app/AppState";
import { useSuspenseQuery } from "@tanstack/react-query";
import { JobsError } from "@/features/jobs/JobsError";
import { filterJobs, jobsQueryOptions } from "@/services/jobs";

export const Route = createFileRoute("/_authenticated/saved")({
  loader: ({ context }) => context.queryClient.ensureQueryData(jobsQueryOptions),
  errorComponent: JobsError,
  notFoundComponent: JobsError,
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Saved jobs — Chitthi" },
      { name: "description", content: "Job leads you've bookmarked on Chitthi." },
      { property: "og:title", content: "Saved jobs — Chitthi" },
      { property: "og:description", content: "Job leads you've bookmarked on Chitthi." },
    ],
  }),
  component: Saved,
});

function Saved() {
  const { data } = useSuspenseQuery(jobsQueryOptions);
  const { saved, search, loading } = useAppState();
  const jobs = filterJobs(data.filter((j) => saved.has(j.id)), { query: search });
  return (
    <AppShell title="Saved jobs" subtitle={`${saved.size} leads kept for later.`}>
      <div className="space-y-4">
        {loading ? <div className="h-64 animate-pulse rounded-2xl bg-muted" /> : jobs.length ? jobs.map((j) => <JobCard key={j.id} job={j} />) : (
          <EmptyState title="Nothing saved yet" body="Tap the bookmark on any lead to keep it here."
            action={<Link to="/" className="text-sm font-medium text-stamp hover:underline">Browse the feed</Link>} />
        )}
      </div>
    </AppShell>
  );
}
