// Mock job service. Swap the body of these functions for real API calls later;
// keep the signatures so components don't change.
import type { Job } from "@/types";
import { mockJobs } from "@/mocks/jobs";

export interface JobFilters {
  query?: string;
  type?: Job["type"] | "All";
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function listJobs(filters: JobFilters = {}): Promise<Job[]> {
  await delay(150);
  return filterJobs(mockJobs, filters);
}

export function filterJobs(jobs: Job[], { query = "", type = "All" }: JobFilters): Job[] {
  const q = query.trim().toLowerCase();
  return jobs.filter((j) => {
    if (type !== "All" && j.type !== type) return false;
    if (!q) return true;
    return [j.role, j.company, j.location, ...j.skills].join(" ").toLowerCase().includes(q);
  });
}

export function getJob(id: string): Job | undefined {
  return mockJobs.find((j) => j.id === id);
}
