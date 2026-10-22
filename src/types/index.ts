// Typed data contracts shared by mock services today and real APIs later.
export type JobType = "Full-time" | "Internship" | "Contract" | "Part-time";
export type WorkMode = "Remote" | "Hybrid" | "On-site";

export interface Job {
  id: string;
  company: string;
  companyInitials: string;
  role: string;
  location: string;
  type: JobType;
  mode: WorkMode;
  salary?: string;
  description: string;
  skills: string[];
  source: string;
  postedAt: string; // ISO date
  applyUrl: string;
}

export type ApplicationStatus = "Saved" | "Applied" | "Interview" | "Offer" | "Rejected";

export interface Application {
  jobId: string;
  status: ApplicationStatus;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  headline: string;
  location: string;
  skills: string[];
}
