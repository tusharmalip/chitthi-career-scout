import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";

export function Logo({ compactOnTablet = false }: { compactOnTablet?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid size-9 place-items-center rounded-xl bg-stamp text-primary-foreground shadow-card">
        <Mail className="size-4.5" />
      </span>
      <span className={`font-display text-xl font-semibold tracking-tight ${compactOnTablet ? "hidden lg:inline" : ""}`}>Chitthi</span>
    </Link>
  );
}
