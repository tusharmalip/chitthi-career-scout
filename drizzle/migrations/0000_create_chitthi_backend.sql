CREATE TABLE public.profiles (
 id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 name text NOT NULL DEFAULT '', headline text NOT NULL DEFAULT '', location text NOT NULL DEFAULT '', skills text[] NOT NULL DEFAULT '{}'
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profiles_owner ON public.profiles FOR ALL TO authenticated USING ((SELECT auth.uid()) = id) WITH CHECK ((SELECT auth.uid()) = id);
CREATE TABLE public.jobs (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company text NOT NULL, company_initials text NOT NULL, role text NOT NULL, location text NOT NULL, type text NOT NULL CHECK (type IN ('Full-time','Internship','Contract','Part-time')), mode text NOT NULL CHECK (mode IN ('Remote','Hybrid','On-site')), salary text, description text NOT NULL, skills text[] NOT NULL DEFAULT '{}', source text NOT NULL, source_post_url text, apply_url text NOT NULL, posted_at timestamptz NOT NULL DEFAULT now(), status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','expired','suspicious')), last_checked_at timestamptz, fail_count int NOT NULL DEFAULT 0, content_hash text UNIQUE, created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.jobs TO anon, authenticated;
GRANT ALL ON public.jobs TO service_role;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY jobs_active_read ON public.jobs FOR SELECT TO anon, authenticated USING (status = 'active');
CREATE INDEX jobs_active_newest ON public.jobs (posted_at DESC) WHERE status = 'active';
CREATE TABLE public.saved_jobs (
 user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE, job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE, created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (user_id, job_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_jobs TO authenticated;
GRANT ALL ON public.saved_jobs TO service_role;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY saved_jobs_owner ON public.saved_jobs FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE TABLE public.applications (
 user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE, job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE, status text NOT NULL CHECK (status IN ('Saved','Applied','Interview','Offer','Rejected')), updated_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (user_id, job_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY applications_owner ON public.applications FOR ALL TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE TABLE public.raw_posts (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), source text NOT NULL, post_url text, raw_text text NOT NULL, content_hash text UNIQUE, processed boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.raw_posts TO service_role;
ALTER TABLE public.raw_posts ENABLE ROW LEVEL SECURITY;
CREATE TABLE public.ingestion_logs (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), run_type text NOT NULL, started_at timestamptz NOT NULL DEFAULT now(), finished_at timestamptz, posts_fetched int NOT NULL DEFAULT 0, jobs_added int NOT NULL DEFAULT 0, jobs_expired int NOT NULL DEFAULT 0, errors text);
GRANT ALL ON public.ingestion_logs TO service_role;
ALTER TABLE public.ingestion_logs ENABLE ROW LEVEL SECURITY;
CREATE FUNCTION public.create_signup_profile() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
 INSERT INTO public.profiles (id, name) VALUES (NEW.id, coalesce(NEW.raw_user_meta_data ->> 'name', ''));
 RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.create_signup_profile() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER on_chitthi_signup AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.create_signup_profile();
INSERT INTO public.jobs (id, company, company_initials, role, location, type, mode, salary, description, skills, source, apply_url, posted_at, content_hash) VALUES
('00000000-0000-4000-8000-000000000001','Razorpay','RZ','Frontend Engineer Intern','Bengaluru','Internship','Hybrid','₹50k / month','Work with the Checkout team on React interfaces used by millions of merchants. Strong JavaScript fundamentals and an eye for detail matter more than years of experience.',ARRAY['React','TypeScript','CSS'],'LinkedIn','https://razorpay.com/jobs/',now(),'chitthi-seed-j1'),
('00000000-0000-4000-8000-000000000002','Zerodha','ZD','Graduate Software Engineer','Bengaluru','Full-time','On-site','₹12–16 LPA','Join a small, focused engineering team building trading and investment platforms. 2025/2026 graduates with solid problem-solving skills are encouraged to apply.',ARRAY['Go','Python','PostgreSQL'],'Careers page','https://zerodha.com/careers/',now()-interval '1 day','chitthi-seed-j2'),
('00000000-0000-4000-8000-000000000003','Swiggy','SW','Data Analyst – Campus Hire','Gurugram','Full-time','Hybrid','₹9–11 LPA','Analyse delivery and marketplace data to support growth decisions. You''ll own dashboards and partner with product managers on experiments.',ARRAY['SQL','Python','Tableau'],'Telegram','https://careers.swiggy.com/',now()-interval '2 days','chitthi-seed-j3'),
('00000000-0000-4000-8000-000000000004','Postman','PM','Developer Relations Intern','Remote','Internship','Remote','₹40k / month','Create tutorials, sample collections and community content around APIs. Great for students who love writing and teaching as much as coding.',ARRAY['APIs','Technical writing','Node.js'],'X / Twitter','https://www.postman.com/company/careers/',now()-interval '3 days','chitthi-seed-j4'),
('00000000-0000-4000-8000-000000000005','Freshworks','FW','Associate Product Designer','Chennai','Full-time','On-site',NULL,'Design end-to-end workflows for our CRM suite. Bring a portfolio that shows research, iteration and polished interaction design.',ARRAY['Figma','UX research','Prototyping'],'LinkedIn','https://www.freshworks.com/company/careers/',now()-interval '4 days','chitthi-seed-j5'),
('00000000-0000-4000-8000-000000000006','CRED','CR','Backend Engineer (Contract, 6 months)','Bengaluru','Contract','Hybrid','₹1.2L / month','Help scale payment reconciliation services. Experience with distributed systems or Kotlin is a strong plus.',ARRAY['Kotlin','Kafka','AWS'],'Careers page','https://careers.cred.club/',now()-interval '6 days','chitthi-seed-j6');