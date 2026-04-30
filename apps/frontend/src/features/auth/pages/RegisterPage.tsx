"use client";

import { RegisterForm } from "@/src/features/auth/components/RegisterForm";
import { AuthShell } from "@/src/features/auth/components/AuthShell";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Get started with your team and secure incident response access."
    >
      <RegisterForm />
    </AuthShell>
  );
}
