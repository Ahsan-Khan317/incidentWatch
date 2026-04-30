"use client";

import { LoginForm } from "@/src/features/auth/components/LoginForm";
import { AuthShell } from "@/src/features/auth/components/AuthShell";

export default function LoginPage() {
  return (
    <AuthShell
      title="Sign in to your account"
      subtitle="Welcome back. Please enter your details."
    >
      <LoginForm />
    </AuthShell>
  );
}
