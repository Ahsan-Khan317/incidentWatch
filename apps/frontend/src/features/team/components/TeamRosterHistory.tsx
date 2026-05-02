import React from "react";

const TeamRosterHistory = () => {
  return (
    <div className="mt-8 rounded border border-border bg-surface-1 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h3 className="text-base font-bold text-heading">
          Recent On-Call Activity
        </h3>
        <span className="cursor-pointer font-mono text-[0.625rem] font-bold uppercase tracking-wider text-primary hover:underline">
          Export Logs
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-surface-2 border-b border-border font-mono text-[0.625rem] font-bold uppercase tracking-widest text-muted">
            <tr>
              <th className="px-6 py-3">Engineer</th>
              <th className="px-6 py-3">Duty Cycle</th>
              <th className="px-6 py-3">Resolved</th>
              <th className="px-6 py-3">Escalated</th>
              <th className="px-6 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr className="transition-colors hover:bg-surface-2">
              <td className="px-6 py-3 font-bold text-heading">
                Marcus Thorne
              </td>
              <td className="px-6 py-3 text-body">Oct 12 - Oct 19</td>
              <td className="px-6 py-3 font-bold text-success">14</td>
              <td className="px-6 py-3 text-muted">1</td>
              <td className="px-6 py-3 text-right">
                <span className="rounded border border-success-border bg-success-soft px-2 py-0.5 font-mono text-[0.625rem] font-bold uppercase text-success">
                  Active
                </span>
              </td>
            </tr>
            <tr className="transition-colors hover:bg-surface-2">
              <td className="px-6 py-3 font-bold text-heading">
                Elena Rodriguez
              </td>
              <td className="px-6 py-3 text-body">Oct 05 - Oct 12</td>
              <td className="px-6 py-3 font-bold text-success">22</td>
              <td className="px-6 py-3 text-muted">0</td>
              <td className="px-6 py-3 text-right">
                <span className="rounded border border-border bg-surface-3 px-2 py-0.5 font-mono text-[0.625rem] font-bold uppercase text-muted">
                  Closed
                </span>
              </td>
            </tr>
            <tr className="transition-colors hover:bg-surface-2">
              <td className="px-6 py-3 font-bold text-heading">Julian Vance</td>
              <td className="px-6 py-3 text-body">Sep 28 - Oct 05</td>
              <td className="px-6 py-3 font-bold text-success">9</td>
              <td className="px-6 py-3 text-danger font-bold">4</td>
              <td className="px-6 py-3 text-right">
                <span className="rounded border border-border bg-surface-3 px-2 py-0.5 font-mono text-[0.625rem] font-bold uppercase text-muted">
                  Closed
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamRosterHistory;
