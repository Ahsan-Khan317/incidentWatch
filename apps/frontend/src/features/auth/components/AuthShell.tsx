import { ReactNode } from "react";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <main className="grow flex items-center justify-center p-4 md:p-8 bg-surface-0 font-body min-h-[calc(100vh)]">
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-page border border-border overflow-hidden">
        <div className="hidden md:flex flex-col w-1/2 p-8 lg:p-10 bg-surface-1 relative overflow-hidden justify-between border-r border-border-soft">
          <div
            className="absolute inset-0 z-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, var(--color-primary) 0%, transparent 50%), radial-gradient(circle at 80% 80%, var(--color-accent) 0%, transparent 50%)",
            }}
          />

          <div className="z-10 relative">
            <div className="flex items-center gap-2 mb-8">
              <ShieldCheck className="text-primary w-8 h-8 select-none" />
              <span className="font-display uppercase text-2xl font-bold text-heading tracking-tight">
                Incident Response
              </span>
            </div>
          </div>

          <div className="z-10 relative mt-auto">
            <h2 className="font-display uppercase text-4xl font-bold text-heading mb-4 tracking-tight">
              Operational Calm.
            </h2>
            <p className="text-lg text-muted mb-10 max-w-md leading-[1.3]">
              Secure, reliable, and ready for your team. Streamline your
              incident workflow with high-density data and minimal noise.
            </p>

            <div className="flex items-center gap-6 border-t border-border pt-6">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="text-success w-4 h-4 select-none" />
                <span className="text-sm font-medium">SOC 2 Type II</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="text-success w-4 h-4 select-none" />
                <span className="text-sm font-medium">SSO Ready</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="text-success w-4 h-4 select-none" />
                <span className="text-sm font-medium">99.99% Uptime</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          <div className="md:hidden flex items-center gap-2 mb-6 justify-center">
            <ShieldCheck className="text-primary w-8 h-8 select-none" />
            <span className="font-display text-2xl font-bold text-heading tracking-tight">
              Incident Response
            </span>
          </div>

          <div className="mb-8 text-center md:text-left">
            <h1 className="font-display text-3xl font-bold text-heading mb-2 tracking-tight">
              {title}
            </h1>
            <p className="text-base text-muted">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </main>
  );
}
