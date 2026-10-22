# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Run Chitthi

Install dependencies with `bun install`, then run `bun run dev`. Run tests with `bun run test`.
The connected Lovable Cloud environment supplies the generated connection configuration; do not commit private keys. Database schema and six sample jobs are included in `drizzle/migrations`.

Email/password accounts require email confirmation before login. Saved leads, applications, and profiles persist per account with owner-only access. Only active jobs are public. The six seeded posts are illustrative, not verified vacancies; their application links open company career pages. Mock jobs appear only if there are zero active database jobs. `listJobs` hydrates the synchronous `getJob` snapshot; callers needing fresh data must await `listJobs` first. Settings switches remain session-only demonstration controls; automated ingestion and notifications are not implemented.
