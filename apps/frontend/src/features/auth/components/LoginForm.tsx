"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import {
  loginSchema,
  type LoginSchema,
} from "@/src/features/auth/schemas/auth.schema";
import { useLogin } from "@/src/features/auth/hooks/useLogin";

const authProviders: Array<{
  id: string;
  label: string;
  icon: ReactNode;
  idDisabled: boolean;
}> = [
  {
    id: "google",
    label: "Continue with Google",
    idDisabled: true,
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z"
          fill="#4285F4"
        />
        <path
          d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.14 18.63 6.71 16.71 5.84 14.14H2.15V16.99C3.96 20.6 7.68 23 12 23Z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.14C5.61 13.48 5.49 12.76 5.49 12C5.49 11.24 5.61 10.52 5.84 9.86V7.01H2.15C1.39 8.52 0.96 10.21 0.96 12C0.96 13.79 1.39 15.48 2.15 16.99L5.84 14.14Z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.68 1 3.96 3.4 2.15 7.01L5.84 9.86C6.71 7.29 9.14 5.38 12 5.38Z"
          fill="#EA4335"
        />
      </svg>
    ),
  },
  {
    id: "sso",
    label: "Continue with SAML/SSO",
    idDisabled: true,
    icon: (
      <div className="text-muted flex items-center justify-center">
        <span className="w-5 h-5 flex items-center justify-center">SSO</span>
      </div>
    ),
  },
];

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginSchema) => {
    const result = loginSchema.safeParse(values);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginSchema;
        setError(field, { type: "manual", message: issue.message });
      });
      return;
    }

    loginMutation.mutate(result.data);
  };

  return (
    <>
      <div className="flex flex-col gap-3 mb-8">
        {authProviders.map((provider) => (
          <button
            disabled={provider.idDisabled}
            key={provider.id}
            type="button"
            className="btn btn-outline w-full flex items-center justify-center gap-3 py-2.5"
          >
            {provider.icon}
            {provider.label}
          </button>
        ))}
      </div>

      <div className="flex items-center mb-8 gap-4">
        <div className="grow border-t border-border"></div>
        <span className="text-xs font-semibold text-muted uppercase tracking-wider">
          Or sign in with email
        </span>
        <div className="grow border-t border-border"></div>
      </div>

      <form
        className="flex flex-col gap-5 text-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
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
          <div className="flex justify-between items-center mb-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider  mb-1.5"
            >
              Password
            </label>
            <a
              href="#"
              className="font-medium text-link hover:text-link-hover transition-colors"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              {...register("password")}
              className="rounded-none pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-2 flex items-center justify-center text-muted transition-colors hover:text-current"
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

        {loginMutation.isError && (
          <div className=" border border-danger-soft bg-danger-soft px-4 py-3 text-sm text-danger">
            {(loginMutation.error as Error)?.message || "Unable to sign in."}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary w-full mt-2 py-2.5 font-medium"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-link hover:text-link-hover hover:underline transition-all"
        >
          Sign up
        </Link>
      </p>
    </>
  );
}
