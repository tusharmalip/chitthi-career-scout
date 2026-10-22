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

- Frontend-only phase: data comes from typed mock services in src/services (backed by src/mocks); components never import mocks directly except via services, so real APIs can replace service bodies later.
- Shared types live in src/types; features in src/features/<name>; app-wide mock state (auth, saved, applications) in src/features/app/AppState.tsx context.
- Pages wrap content in components/layout/AppShell (rail + top search + mobile bottom nav) instead of a pathless layout route.
