import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { JobCard } from "@/features/jobs/JobCard";
import { EmptyState } from "@/components/common/Chip";
import { useAppState } from "@/features/app/AppState";
import { mockJobs } from "@/mocks/jobs";
import { filterJobs } from "@/services/jobs";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved jobs — Chitthi" },
      { name: "description", content: "Job leads you've bookmarked on Chitthi." },
      { property: "og:title", content: "Saved jobs — Chitthi" },
      { property: "og:description", content: "Job leads you've bookmarked on Chitthi." },
    ],
  }),
  component: Saved,
});

function Saved() {
  const { saved, search } = useAppState();
  const jobs = filterJobs(mockJobs.filter((j) => saved.has(j.id)), { query: search });
  return (
    <AppShell title="Saved jobs" subtitle={`${saved.size} leads kept for later.`}>
      <div className="space-y-4">
        {jobs.length ? jobs.map((j) => <JobCard key={j.id} job={j} />) : (
          <EmptyState title="Nothing saved yet" body="Tap the bookmark on any lead to keep it here."
            action={<Link to="/" className="text-sm font-medium text-stamp hover:underline">Browse the feed</Link>} />
        )}
      </div>
    </AppShell>
  );
}
