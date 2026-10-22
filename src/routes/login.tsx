import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/features/auth/AuthLayout";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Log in — Chitthi" },
      { name: "description", content: "Log in to your Chitthi job feed." },
      { property: "og:title", content: "Log in — Chitthi" },
      { property: "og:description", content: "Log in to your Chitthi job feed." },
    ],
  }),
  component: () => <AuthForm mode="login" />,
});
