import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/features/auth/AuthLayout";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — Chitthi" },
      { name: "description", content: "Create a Chitthi account and start collecting job leads." },
      { property: "og:title", content: "Sign up — Chitthi" },
      { property: "og:description", content: "Create a Chitthi account and start collecting job leads." },
    ],
  }),
  component: () => <AuthForm mode="signup" />,
});
