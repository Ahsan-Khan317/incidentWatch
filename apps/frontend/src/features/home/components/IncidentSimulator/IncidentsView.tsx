"use client";
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, BrainCircuit, Clock, AlertTriangle } from "lucide-react";
import { Incident } from "./types";

interface IncidentsViewProps {
  incidents: Incident[];
  resolveInc: (id: string) => void;
  ackInc: (id: string) => void;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({
  incidents,
  resolveInc,
  ackInc,
}) => {
  return (
    <div className="space-y-6">
      {incidents.filter((i) => i.status === "open").length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted opacity-40">
          <CheckCircle2 size={48} className="mb-4" />
          <p className="text-sm font-bold uppercase tracking-widest">
            No Active Incidents
          </p>
        </div>
      ) : (
        incidents
          .filter((i) => i.status === "open")
          .map((inc) => (
            <motion.div
              key={inc.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`group relative p-6 rounded-sm border border-border-soft bg-surface-1 shadow-2xl transition-all duration-300 overflow-hidden ${
                inc.sev === "SEV1"
                  ? "border-t-[6px] border-t-danger"
                  : "border-t-[6px] border-t-warning"
              }`}
            >
              {/* Glow Background Layer */}
              <div
                className={`absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none transition-opacity group-hover:opacity-5 ${
                  inc.sev === "SEV1" ? "bg-danger" : "bg-warning"
                }`}
              />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-mono font-bold text-muted bg-accent/5 px-2 py-0.5 rounded tracking-tighter">
                        {inc.id}
                      </span>
                      <span
                        className={`text-[10px] font-display font-black px-2.5 py-0.5 rounded uppercase tracking-widest border ${
                          inc.sev === "SEV1"
                            ? "bg-danger/10 text-danger border-danger/20"
                            : "bg-warning/10 text-warning border-warning/20"
                        }`}
                      >
                        {inc.sev}
                      </span>
                    </div>
                    <h3 className="text-base md:text-lg font-display font-bold text-heading leading-tight tracking-tight uppercase">
                      {inc.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => resolveInc(inc.id)}
                    className="px-5 py-2 bg-success text-success-content text-[10px] font-bold uppercase tracking-widest rounded-none hover:opacity-90 active:scale-95 transition-all"
                  >
                    Resolve
                  </button>
                </div>

                {inc.aiStatus === "done" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-5 bg-accent/5 dark:bg-[#0a0a0a]/60 backdrop-blur-xl border border-border-soft rounded-none mb-6 relative overflow-hidden"
                  >
                    {/* AI Scanline effect */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/20 animate-scanline pointer-events-none opacity-40 dark:opacity-100" />

                    <div className="flex items-start gap-5">
                      <div className="p-3 bg-primary/10 rounded-full border border-primary/20 shadow-sm">
                        <BrainCircuit
                          size={20}
                          className="text-primary animate-pulse"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-display font-bold text-primary uppercase tracking-[0.2em]">
                              AI Root Cause Analysis
                            </span>
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                          </div>
                          <span className="text-[10px] font-mono font-bold text-muted uppercase">
                            Confidence:{" "}
                            <span className="text-primary">{inc.sc.conf}%</span>
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-heading leading-relaxed mb-5 font-medium italic opacity-90">
                          "{inc.sc.root}"
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="p-3 bg-black/5 dark:bg-white/5 border-l-2 border-danger/40">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle
                                size={12}
                                className="text-danger"
                              />
                              <span className="text-[9px] font-display font-bold text-danger uppercase tracking-widest">
                                Blast Radius
                              </span>
                            </div>
                            <p className="text-[11px] text-body-strong font-medium">
                              {inc.sc.impact}
                            </p>
                          </div>
                          <div className="p-3 bg-black/5 dark:bg-white/5 border-l-2 border-success/40">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2
                                size={12}
                                className="text-success"
                              />
                              <span className="text-[9px] font-display font-bold text-success uppercase tracking-widest">
                                Remediation Path
                              </span>
                            </div>
                            <p className="text-[11px] text-body-strong font-medium">
                              {inc.sc.fix}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  inc.aiStatus === "thinking" && (
                    <div className="p-10 mb-6 bg-accent/5 border border-border-soft flex flex-col items-center justify-center gap-4 animate-pulse">
                      <BrainCircuit size={32} className="text-primary/40" />
                      <p className="text-[10px] font-display font-bold text-muted uppercase tracking-[0.3em]">
                        AI Correlating Logs...
                      </p>
                    </div>
                  )
                )}

                <div className="flex flex-wrap items-center gap-y-4 gap-x-8 pt-5 border-t border-border-soft">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full border border-border-soft flex items-center justify-center text-[11px] font-black shadow-inner ${inc.responder?.av || "bg-surface-3 text-muted"}`}
                    >
                      {inc.responder?.id || "?"}
                    </div>
                    <div>
                      <p className="text-[10px] font-display font-bold text-heading uppercase tracking-wide">
                        {inc.responder?.name || "Pending Assignment"}
                      </p>
                      <p className="text-[9px] text-muted font-bold uppercase tracking-tight">
                        {inc.assignMode} expertise match
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-accent/5 px-3 py-1.5 rounded-full border border-border-soft">
                    <Clock size={12} className="text-muted" />
                    <p className="text-[10px] font-mono font-bold text-heading">
                      {inc.ts}
                    </p>
                  </div>
                  <div className="flex-1 flex justify-end">
                    <button
                      onClick={() => ackInc(inc.id)}
                      disabled={inc.acked}
                      className={`px-4 py-2 rounded-none text-[10px] font-display font-black uppercase tracking-widest transition-all ${
                        inc.acked
                          ? "bg-accent/5 text-muted border border-border-soft cursor-not-allowed"
                          : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 shadow-sm"
                      }`}
                    >
                      {inc.acked ? "Acknowledged" : "Acknowledge"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
      )}
    </div>
  );
};
