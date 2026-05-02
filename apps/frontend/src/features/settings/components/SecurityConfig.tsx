import React from "react";
import { History, ShieldCheck } from "lucide-react";

const SecurityConfig = () => {
  return (
    <div className="rounded border border-border bg-surface-1 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-border p-6">
        <div>
          <h4 className="text-sm font-bold text-heading">
            Two-Factor Auth (2FA)
          </h4>
          <p className="text-xs text-muted">
            Require an authenticator app for all admin logins.
          </p>
        </div>
        <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[0.625rem] font-bold uppercase text-emerald-400">
          Enforced
        </span>
      </div>

      <div className="flex items-center justify-between p-6">
        <div>
          <h4 className="text-sm font-bold text-heading">Session Duration</h4>
          <p className="text-xs text-muted">
            Logout inactive users after a set period.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="number"
            defaultValue="12"
            className="w-16 rounded border border-border bg-surface-2 px-2 py-1 text-center text-sm text-heading outline-none focus:border-primary"
          />
          <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted">
            Hours
          </span>
        </div>
      </div>

      <div className="border-t border-border bg-surface-2 p-6">
        <button className="flex w-full items-center justify-center gap-2 rounded border border-border bg-surface-1 py-3 text-[0.625rem] font-bold uppercase tracking-widest text-muted transition-all hover:bg-surface-2 hover:text-heading group">
          <History
            size={14}
            className="transition-transform group-hover:-rotate-45"
          />
          View System Audit Logs
        </button>
      </div>
    </div>
  );
};

export default SecurityConfig;
