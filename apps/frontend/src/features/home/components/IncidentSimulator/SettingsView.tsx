"use client";
import React from "react";
import { motion } from "framer-motion";
import { TeamMember } from "./types";

interface SettingsViewProps {
  cfg: { autoAssign: boolean; autoEscalate: boolean; escalateMin: number };
  setCfg: React.Dispatch<
    React.SetStateAction<{
      autoAssign: boolean;
      autoEscalate: boolean;
      escalateMin: number;
    }>
  >;
  team: TeamMember[];
  setTeam: React.Dispatch<React.SetStateAction<TeamMember[]>>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  cfg,
  setCfg,
  team,
  setTeam,
}) => {
  return (
    <div className="space-y-6">
      {[
        {
          title: "Auto-assign responders",
          sub: "Match on-call engineer by expertise on incident create",
          key: "autoAssign",
        },
        {
          title: "Auto-escalate if unacknowledged",
          sub: "Escalate to next on-call after timeout",
          key: "autoEscalate",
        },
      ].map((s, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 bg-surface-2 border border-border-soft rounded-xl"
        >
          <div>
            <h4 className="text-xs font-bold text-heading">{s.title}</h4>
            <p className="text-[10px] text-muted mt-1">{s.sub}</p>
          </div>
          <button
            onClick={() =>
              setCfg((prev) => ({ ...prev, [s.key]: !(prev as any)[s.key] }))
            }
            className={`w-10 h-5 rounded-full relative transition-colors ${
              (cfg as any)[s.key] ? "bg-primary" : "bg-surface-3"
            }`}
          >
            <motion.div
              animate={{ x: (cfg as any)[s.key] ? 20 : 2 }}
              className="w-4 h-4 bg-white rounded-full absolute top-0.5"
            />
          </button>
        </div>
      ))}

      <div className="pt-6">
        <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-4">
          On-Call Roster
        </p>
        <div className="space-y-3">
          {team.map((m) => (
            <div
              key={m.id}
              className="p-4 bg-surface-2 border border-border-soft rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${m.av}`}
                >
                  {m.id}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-heading">{m.name}</h4>
                  <p className="text-[10px] text-muted">
                    {m.role} · {m.exp.join(", ")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-bold uppercase ${m.duty ? "text-success" : "text-muted"}`}
                >
                  {m.duty ? "On-Duty" : "Off-Duty"}
                </span>
                <button
                  onClick={() =>
                    setTeam((prev) =>
                      prev.map((t) =>
                        t.id === m.id ? { ...t, duty: !t.duty } : t,
                      ),
                    )
                  }
                  className={`w-10 h-5 rounded-full relative transition-colors ${
                    m.duty ? "bg-success" : "bg-surface-3"
                  }`}
                >
                  <motion.div
                    animate={{ x: m.duty ? 20 : 2 }}
                    className="w-4 h-4 bg-white rounded-full absolute top-0.5"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
