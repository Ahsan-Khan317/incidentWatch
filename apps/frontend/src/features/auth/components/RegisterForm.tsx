"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import {
  registerSchema,
  type RegisterSchema,
} from "@/src/features/auth/schemas/auth.schema";
import { useRegister } from "@/src/features/auth/hooks/useRegister";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterSchema>({
    defaultValues: {
      organizationName: "",
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: RegisterSchema) => {
    const result = registerSchema.safeParse(values);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof RegisterSchema;
        setError(field, { type: "manual", message: issue.message });
      });
      return;
    }

    registerMutation.mutate({
      organizationName: result.data.organizationName,
      name: result.data.name,
      email: result.data.email,
      password: result.data.password,
    });
  };

  return (
    <>
      <form
        className="flex flex-col gap-5 text-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label
            htmlFor="Organization Name"
            className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
          >
            Organization Name
          </label>
          <input
            id="organizationName"
            type="text"
            placeholder="Acme Inc."
            autoComplete="organizationName"
            {...register("organizationName")}
            className="rounded-none"
          />
          {errors.organizationName && (
            <p className="mt-1 text-sm text-danger">
              {errors.organizationName.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-semibold uppercase tracking-wider  mb-1.5"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Jane Doe"
            autoComplete="name"
            {...register("name")}
            className="rounded-none"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-danger">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider  mb-1.5"
          >
            Work Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@company.com"
            autoComplete="email"
            {...register("email")}
            className="rounded-none"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-danger">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold uppercase tracking-wider  mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              {...register("password")}
              className="rounded-none pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-2 flex items-center justify-center  transition-colors hover:text-current"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <HugeiconsIcon
                icon={showPassword ? ViewOffSlashIcon : ViewIcon}
                size={20}
                color="currentColor"
                strokeWidth={1.5}
              />
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-danger">
              {errors.password.message}
            </p>
          )}
        </div>
        {registerMutation.isError && (
          <div className="border border-danger-soft bg-danger-soft px-4 py-3 text-sm text-danger">
            {(registerMutation.error as Error)?.message ||
              "Unable to create account."}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-full mt-2 py-2.5 font-medium"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Creating account…" : "Sign Up"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-link hover:text-link-hover hover:underline transition-all"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
