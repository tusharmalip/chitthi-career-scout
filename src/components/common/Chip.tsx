import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
  stamp: "bg-stamp-soft text-stamp",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-stamp-soft text-destructive",
} as const;

export type ChipTone = keyof typeof tones;

export function Chip({ tone = "neutral", children, className }: { tone?: ChipTone; children: ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", tones[tone], className)}>{children}</span>;
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed bg-card/60 p-10 text-center">
      <p className="font-display text-xl">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
