import React from "react";
import { Mail, UserMinus } from "lucide-react";
import SectionHeading from "@/src/components/dashboard/common/SectionHeading";

interface Invite {
  _id: string;
  email: string;
  role: string;
  tier: number;
  expertise: string[];
  expiresAt: string;
  createdAt: string;
}

interface PendingInvitesProps {
  invites: Invite[];
  onRevoke: (id: string) => void;
}

const PendingInvites: React.FC<PendingInvitesProps> = ({
  invites,
  onRevoke,
}) => {
  if (invites.length === 0) return null;

  return (
    <div className="mt-12">
      <SectionHeading
        title="Pending Deployments"
        description="Active invitations awaiting member acceptance and synchronization."
      />

      <div className="mt-6 overflow-hidden border border-border bg-surface-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-2/50">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted/60">
                member Email
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted/60">
                Assigned Role
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted/60">
                Expertise
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted/60">
                Status
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted/60 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {invites.map((invite) => (
              <tr
                key={invite._id}
                className="group hover:bg-surface-2/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center border border-border bg-surface-2 text-muted/40">
                      <Mail size={14} />
                    </div>
                    <span className="text-xs font-bold text-heading tracking-tight">
                      {invite.email}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
                    Tier {invite.tier} • {invite.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {invite.expertise.map((exp, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 border border-border bg-surface-2/50 text-[9px] font-mono text-muted/60 uppercase"
                      >
                        {exp}
                      </span>
                    ))}
                    {invite.expertise.length === 0 && (
                      <span className="text-[9px] italic text-muted/30 uppercase tracking-widest">
                        Unspecified
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-1 animate-pulse rounded-full bg-warning shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-warning/80">
                      Pending Sync
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onRevoke(invite._id)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-muted/40 hover:text-danger hover:bg-danger/5 transition-all"
                  >
                    <UserMinus size={12} />
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingInvites;
