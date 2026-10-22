import type { Job, User } from "@/types";

const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();

export const mockJobs: Job[] = [
  {
    id: "j1", company: "Razorpay", companyInitials: "RZ", role: "Frontend Engineer Intern",
    location: "Bengaluru", type: "Internship", mode: "Hybrid", salary: "₹50k / month",
    description: "Work with the Checkout team on React interfaces used by millions of merchants. Strong JavaScript fundamentals and an eye for detail matter more than years of experience.",
    skills: ["React", "TypeScript", "CSS"], source: "LinkedIn", postedAt: daysAgo(0), applyUrl: "#",
  },
  {
    id: "j2", company: "Zerodha", companyInitials: "ZD", role: "Graduate Software Engineer",
    location: "Bengaluru", type: "Full-time", mode: "On-site", salary: "₹12–16 LPA",
    description: "Join a small, focused engineering team building trading and investment platforms. 2025/2026 graduates with solid problem-solving skills are encouraged to apply.",
    skills: ["Go", "Python", "PostgreSQL"], source: "Careers page", postedAt: daysAgo(1), applyUrl: "#",
  },
  {
    id: "j3", company: "Swiggy", companyInitials: "SW", role: "Data Analyst – Campus Hire",
    location: "Gurugram", type: "Full-time", mode: "Hybrid", salary: "₹9–11 LPA",
    description: "Analyse delivery and marketplace data to support growth decisions. You'll own dashboards and partner with product managers on experiments.",
    skills: ["SQL", "Python", "Tableau"], source: "Telegram", postedAt: daysAgo(2), applyUrl: "#",
  },
  {
    id: "j4", company: "Postman", companyInitials: "PM", role: "Developer Relations Intern",
    location: "Remote", type: "Internship", mode: "Remote", salary: "₹40k / month",
    description: "Create tutorials, sample collections and community content around APIs. Great for students who love writing and teaching as much as coding.",
    skills: ["APIs", "Technical writing", "Node.js"], source: "X / Twitter", postedAt: daysAgo(3), applyUrl: "#",
  },
  {
    id: "j5", company: "Freshworks", companyInitials: "FW", role: "Associate Product Designer",
    location: "Chennai", type: "Full-time", mode: "On-site",
    description: "Design end-to-end workflows for our CRM suite. Bring a portfolio that shows research, iteration and polished interaction design.",
    skills: ["Figma", "UX research", "Prototyping"], source: "LinkedIn", postedAt: daysAgo(4), applyUrl: "#",
  },
  {
    id: "j6", company: "CRED", companyInitials: "CR", role: "Backend Engineer (Contract, 6 months)",
    location: "Bengaluru", type: "Contract", mode: "Hybrid", salary: "₹1.2L / month",
    description: "Help scale payment reconciliation services. Experience with distributed systems or Kotlin is a strong plus.",
    skills: ["Kotlin", "Kafka", "AWS"], source: "Careers page", postedAt: daysAgo(6), applyUrl: "#",
  },
];

export const mockUser: User = {
  id: "u1", name: "Aarav Sharma", email: "aarav@example.com",
  headline: "Final-year CSE student · Frontend & data enthusiast", location: "Pune, India",
  skills: ["React", "TypeScript", "Python", "SQL", "Figma"],
};
