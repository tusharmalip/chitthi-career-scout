import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Logo } from "@/components/common/Logo";
import { useAppState } from "@/features/app/AppState";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const { signIn } = useAppState();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const isLogin = mode === "login";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    signIn(email); // mock only — no real authentication
    navigate({ to: "/" });
  };

  const field = "h-11 w-full rounded-xl border bg-card px-4 text-sm outline-none focus:border-stamp focus:ring-2 focus:ring-ring/20";

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <div className="absolute -right-24 -top-24 size-80 rounded-full bg-stamp/30 blur-3xl" />
        <p className="font-display text-2xl">Chitthi</p>
        <div className="relative">
          <h1 className="max-w-md text-5xl leading-tight">Every opening, delivered like a letter.</h1>
          <p className="mt-4 max-w-sm text-primary-foreground/70">Internships and early-career roles from across the web, gathered into one calm feed.</p>
        </div>
        <p className="text-sm text-primary-foreground/60">Demo build · mock data only</p>
      </section>
      <section className="flex items-center justify-center p-6 paper-grain">
        <form onSubmit={submit} className="w-full max-w-sm space-y-5">
          <div className="lg:hidden"><Logo /></div>
          <div>
            <h2 className="text-3xl">{isLogin ? "Welcome back" : "Create your account"}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{isLogin ? "Log in to see today's leads." : "Start collecting opportunities in minutes."}</p>
          </div>
          {!isLogin && <input required placeholder="Full name" className={field} />}
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@college.edu" className={field} />
          <input required type="password" placeholder="Password" className={field} />
          <button className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90">
            {isLogin ? "Log in" : "Sign up"}
          </button>
          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "New to Chitthi? " : "Already have an account? "}
            <Link to={isLogin ? "/signup" : "/login"} className="font-medium text-stamp hover:underline">{isLogin ? "Sign up" : "Log in"}</Link>
          </p>
        </form>
      </section>
    </div>
  );
}
