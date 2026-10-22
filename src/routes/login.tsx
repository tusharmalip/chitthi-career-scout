import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/features/auth/AuthLayout";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Chitthi" },
      { name: "description", content: "Log in to your Chitthi job feed." },
      { property: "og:title", content: "Log in — Chitthi" },
      { property: "og:description", content: "Log in to your Chitthi job feed." },
    ],
  }),
  component: () => <AuthForm mode="login" />,
});
