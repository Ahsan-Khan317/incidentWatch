import React from "react";

interface ActivityItem {
  name: string;
  email: string;
  resolved: number;
  status: string;
  dutyCycle: string;
}

interface TeamRosterHistoryProps {
  activity?: ActivityItem[];
}

const TeamRosterHistory: React.FC<TeamRosterHistoryProps> = ({ activity }) => {
  return (
    <div className="mt-8 rounded-none border border-border bg-surface-1 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h3 className="text-sm font-bold text-heading uppercase tracking-tight">
          Recent On-Call Activity
        </h3>
        <span className="cursor-pointer font-mono text-[0.625rem] font-bold uppercase tracking-[0.2em] text-primary hover:underline">
          Export Logs
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-surface-2 border-b border-border font-mono text-[0.5625rem] font-bold uppercase tracking-[0.15em] text-muted/60">
            <tr>
              <th className="px-6 py-4 font-bold">Engineer</th>
              <th className="px-6 py-4 font-bold">Duty Cycle</th>
              <th className="px-6 py-4 font-bold">Resolved</th>
              <th className="px-6 py-4 font-bold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {activity && activity.length > 0 ? (
              activity.map((item, index) => (
                <tr
                  key={index}
                  className="transition-colors hover:bg-surface-2/50 group"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-heading text-xs uppercase tracking-tight">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-muted/50 font-mono">
                        {item.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-body text-xs font-mono text-muted/80">
                    {item.dutyCycle}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-success text-xs bg-success-soft/30 px-2 py-0.5 border border-success-border/20">
                      {item.resolved}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`rounded-none border px-2 py-0.5 font-mono text-[0.5625rem] font-bold uppercase tracking-[0.1em] ${
                        item.status === "Active"
                          ? "border-success-border bg-success-soft text-success"
                          : "border-border bg-surface-3 text-muted/60"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-xs text-muted/40 italic uppercase tracking-widest"
                >
                  No recent activity records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamRosterHistory;
