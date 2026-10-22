import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Chip, type ChipTone } from "@/components/common/Chip";
import { useAppState } from "@/features/app/AppState";
import { useSuspenseQuery } from "@tanstack/react-query";
import { JobsError } from "@/features/jobs/JobsError";
import { getJob, jobsQueryOptions } from "@/services/jobs";
import type { ApplicationStatus } from "@/types";

export const Route = createFileRoute("/_authenticated/tracker")({
  loader: ({ context }) => context.queryClient.ensureQueryData(jobsQueryOptions),
  errorComponent: JobsError,
  notFoundComponent: JobsError,
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Application tracker — Chitthi" },
      { name: "description", content: "Track every application from applied to offer." },
      { property: "og:title", content: "Application tracker — Chitthi" },
      { property: "og:description", content: "Track every application from applied to offer." },
    ],
  }),
  component: Tracker,
});

const columns: { status: ApplicationStatus; tone: ChipTone }[] = [
  { status: "Applied", tone: "accent" },
  { status: "Interview", tone: "warning" },
  { status: "Offer", tone: "success" },
  { status: "Rejected", tone: "danger" },
];
const statuses: ApplicationStatus[] = ["Applied", "Interview", "Offer", "Rejected"];

function Tracker() {
  const { data: jobs } = useSuspenseQuery(jobsQueryOptions);
  const { applications, setStatus, loading } = useAppState();
  return (
    <AppShell title="Application tracker" subtitle="Move each application along as you hear back.">
      {loading ? <div className="h-64 animate-pulse rounded-2xl bg-muted" /> : <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {columns.map(({ status, tone }) => {
          const items = applications.filter((a) => a.status === status);
          return (
            <section key={status} className="rounded-2xl border bg-secondary/60 p-3">
              <header className="mb-3 flex items-center justify-between px-1">
                <Chip tone={tone}>{status}</Chip>
                <span className="text-sm text-muted-foreground">{items.length}</span>
              </header>
              <div className="space-y-2">
                {items.length === 0 && <p className="px-1 py-4 text-center text-sm text-muted-foreground">Empty</p>}
                {items.map((a) => {
                  const job = jobs.find((job) => job.id === a.jobId) ?? getJob(a.jobId);
                  if (!job) return null;
                  return (
                    <div key={a.jobId} className="rounded-xl border bg-card p-3 shadow-card">
                      <p className="text-xs text-muted-foreground">{job.company}</p>
                      <p className="font-medium leading-snug">{job.role}</p>
                      <select value={a.status} onChange={(e) => setStatus(a.jobId, e.target.value as ApplicationStatus)}
                        aria-label="Change status" className="mt-2 w-full rounded-lg border bg-background px-2 py-1 text-sm">
                        {statuses.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>}
    </AppShell>
  );
}
