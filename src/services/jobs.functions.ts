import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Public reads use the publishable client, never the privileged client.
export const readActiveJobs = createServerFn({ method: 'GET' }).handler(async () => {
  const url = process.env['SUPABASE_URL'];
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) throw new Error('Job connection is unavailable. Please try again.');
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
      headers.set('apikey', key);
      return fetch(input, { ...init, headers });
    } },
  });
  const { data, error } = await client.from('jobs')
    .select('id,company,company_initials,role,location,type,mode,salary,description,skills,source,apply_url,posted_at')
    .eq('status', 'active').order('posted_at', { ascending: false });
  if (error) throw new Error('We couldn’t load the leads. Please try again.');
  return data;
});