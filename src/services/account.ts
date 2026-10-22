import { supabase } from '@/integrations/supabase/client';
import type { Application, ApplicationStatus, User } from '@/types';

export async function currentAccount() {
  const { data, error } = await supabase.auth.getUser();
  if (error && error.name !== 'AuthSessionMissingError') throw error;
  return data.user;
}

export async function readAccount(userId: string, email: string): Promise<{ user: User; saved: Set<string>; applications: Application[] }> {
  const [profile, saved, applications] = await Promise.all([
    supabase.from('profiles').select('id,name,headline,location,skills').eq('id', userId).single(),
    supabase.from('saved_jobs').select('job_id').eq('user_id', userId),
    supabase.from('applications').select('job_id,status,updated_at').eq('user_id', userId),
  ]);
  if (profile.error || saved.error || applications.error) throw new Error('Your account couldn’t load. Please try again.');
  return {
    user: { ...profile.data, email },
    saved: new Set(saved.data.map((row) => row.job_id)),
    applications: applications.data.map((row) => ({ jobId: row.job_id, status: row.status as ApplicationStatus, updatedAt: row.updated_at })),
  };
}

export async function writeSaved(userId: string, jobId: string, saved: boolean) {
  const result = saved
    ? await supabase.from('saved_jobs').delete().eq('user_id', userId).eq('job_id', jobId)
    : await supabase.from('saved_jobs').insert({ user_id: userId, job_id: jobId });
  if (result.error) throw new Error('This lead couldn’t be saved. Please try again.');
}

export async function writeStatus(userId: string, jobId: string, status: ApplicationStatus) {
  const { error } = await supabase.from('applications').upsert({ user_id: userId, job_id: jobId, status, updated_at: new Date().toISOString() }, { onConflict: 'user_id,job_id' });
  if (error) throw new Error('The application couldn’t be updated. Please try again.');
}

export async function writeProfile(user: User) {
  const { error } = await supabase.from('profiles').update({ name: user.name, headline: user.headline, location: user.location, skills: user.skills }).eq('id', user.id).select('id').single();
  if (error) throw new Error('Your profile couldn’t be saved. Please try again.');
}