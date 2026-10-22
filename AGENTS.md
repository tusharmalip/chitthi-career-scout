<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Data access stays in typed src/services modules; public job reads use a publishable server function and account mutations use the browser client with owner-scoped RLS, keeping credentials and permissions isolated.
- Preserve the synchronous getJob contract as a public-data snapshot hydrated by listJobs; render from query data first to avoid async lookups during rendering.
- Shared types live in src/types; features in src/features/<name>; app-wide session-backed state (auth, saved, applications) in src/features/app/AppState.tsx context.
- Pages wrap content in components/layout/AppShell (rail + top search + mobile bottom nav) while protected pages use the Cloud pathless account gate without changing public URLs; the sign-in destination is /login to preserve the existing navigation.
