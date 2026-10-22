import { beforeEach, describe, expect, it, vi } from 'vitest';
const { read } = vi.hoisted(() => ({ read: vi.fn() }));
vi.mock('@/services/jobs.functions', () => ({ readActiveJobs: read }));
import { filterJobs, getJob, listJobs } from '@/services/jobs';

const row = { id: 'real-id', company: 'Razorpay', company_initials: 'RZ', role: 'Frontend Engineer Intern', location: 'Bengaluru', type: 'Internship', mode: 'Hybrid', salary: null, description: 'React engineering', skills: ['React'], source: 'Careers page', posted_at: '2026-10-22T00:00:00Z', apply_url: 'https://razorpay.com/jobs/' };
describe('Real job service contract', () => {
  beforeEach(() => read.mockReset());
  it('maps database jobs and hydrates synchronous lookup', async () => {
    read.mockResolvedValue([row]);
    const jobs = await listJobs();
    expect(jobs[0].id).toBe('real-id');
    expect(getJob('real-id')?.applyUrl).toBe('https://razorpay.com/jobs/');
  });
  it('falls back to all six sample jobs only for zero active jobs', async () => {
    read.mockResolvedValue([]);
    const jobs = await listJobs();
    expect(jobs).toHaveLength(6);
    expect(jobs.map((job) => job.company)).toEqual(['Razorpay', 'Zerodha', 'Swiggy', 'Postman', 'Freshworks', 'CRED']);
  });
  it('does not show fallback for unmatched filters', async () => {
    read.mockResolvedValue([row]);
    expect(await listJobs({ query: 'unmatched' })).toEqual([]);
  });
  it('does not hide database errors behind mock jobs', async () => {
    read.mockRejectedValue(new Error('Unavailable'));
    await expect(listJobs()).rejects.toThrow('Unavailable');
  });
  it('retains case-insensitive skill search and exact type filtering', async () => {
    read.mockResolvedValue([row]);
    const jobs = await listJobs();
    expect(filterJobs(jobs, { query: ' REACT ', type: 'Internship' })).toHaveLength(1);
    expect(filterJobs(jobs, { query: 'React', type: 'Full-time' })).toEqual([]);
  });
});