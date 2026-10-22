import { Bookmark, BookmarkCheck, MapPin, Briefcase, Send, Share2, Clock } from "lucide-react";
import { toast } from "sonner";
import type { Job } from "@/types";
import { Chip } from "@/components/common/Chip";
import { useAppState } from "@/features/app/AppState";
import { cn } from "@/lib/utils";

function timeAgo(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  return d === 0 ? "Today" : d === 1 ? "Yesterday" : `${d}d ago`;
}

export function JobCard({ job }: { job: Job }) {
  const { saved, toggleSaved, applications, setStatus } = useAppState();
  const isSaved = saved.has(job.id);
  const app = applications.find((a) => a.jobId === job.id);
  const applied = app && app.status !== "Saved";

  return (
    <article className="group rounded-2xl border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift sm:p-6">
      <header className="flex items-start gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent font-display text-lg font-semibold text-accent-foreground">
          {job.companyInitials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-muted-foreground">{job.company}</p>
          <h2 className="mt-0.5 text-xl leading-snug">{job.role}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" />{job.location}</span>
            <span className="inline-flex items-center gap-1"><Briefcase className="size-3.5" />{job.type} · {job.mode}</span>
            <span className="inline-flex items-center gap-1"><Clock className="size-3.5" />{timeAgo(job.postedAt)}</span>
          </div>
        </div>
        <button onClick={() => { toggleSaved(job.id); toast(isSaved ? "Removed from saved" : "Saved for later"); }}
          aria-label={isSaved ? "Unsave job" : "Save job"}
          className={cn("grid size-10 shrink-0 place-items-center rounded-full border transition", isSaved ? "border-stamp bg-stamp-soft text-stamp" : "text-muted-foreground hover:text-foreground")}>
          {isSaved ? <BookmarkCheck className="size-4.5" /> : <Bookmark className="size-4.5" />}
        </button>
      </header>

      <p className="mt-4 text-[15px] leading-relaxed text-foreground/85">{job.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {job.type === "Internship" && <Chip tone="stamp">Internship</Chip>}
        {job.salary && <Chip tone="success">{job.salary}</Chip>}
        {job.skills.map((s) => <Chip key={s}>{s}</Chip>)}
      </div>

      <footer className="mt-5 flex flex-wrap items-center gap-2 border-t pt-4">
        <button onClick={() => { setStatus(job.id, "Applied"); toast.success(`Marked as applied at ${job.company}`); }} disabled={applied}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60">
          <Send className="size-4" />{applied ? app.status : "Apply"}
        </button>
        <button onClick={() => toast("Share link copied (demo)")}
          className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <Share2 className="size-4" />Share
        </button>
        <span className="ml-auto text-xs text-muted-foreground">via {job.source}</span>
      </footer>
    </article>
  );
}
