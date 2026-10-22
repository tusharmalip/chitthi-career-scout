// Preserve the public contracts; async listJobs hydrates the synchronous getJob snapshot.
import type { Job } from "@/types";
import { mockJobs } from "@/mocks/jobs";
import { readActiveJobs } from './jobs.functions';
import { queryOptions } from '@tanstack/react-query';

export interface JobFilters {
  query?: string;
  type?: Job["type"] | "All";
}

let activeSnapshot: Job[] = [];

export const jobsQueryOptions = queryOptions({
  queryKey: ['jobs'],
  queryFn: () => listJobs(),
  staleTime: 30_000,
});

export async function listJobs(filters: JobFilters = {}): Promise<Job[]> {
  const rows = await readActiveJobs();
  activeSnapshot = rows.length ? rows.map((row) => ({
    id: row.id, company: row.company, companyInitials: row.company_initials,
    role: row.role, location: row.location, type: row.type as Job['type'], mode: row.mode as Job['mode'],
    salary: row.salary ?? undefined, description: row.description, skills: row.skills,
    source: row.source, postedAt: row.posted_at, applyUrl: row.apply_url,
  })) : mockJobs.map((job, index) => ({ ...job,
    id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
    applyUrl: ['https://razorpay.com/jobs/', 'https://zerodha.com/careers/', 'https://careers.swiggy.com/', 'https://www.postman.com/company/careers/', 'https://www.freshworks.com/company/careers/', 'https://careers.cred.club/'][index] ?? '',
  }));
  return filterJobs(activeSnapshot, filters);
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
  return activeSnapshot.find((j) => j.id === id);
}
