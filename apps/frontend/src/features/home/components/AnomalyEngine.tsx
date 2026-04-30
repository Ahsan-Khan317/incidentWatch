"use client";
import React from "react";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert01Icon,
  DashboardSquare01Icon,
  SourceCodeIcon,
  ShieldUserIcon,
} from "@hugeicons/core-free-icons";

export const AnomalyEngine = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden border-t border-dashed border-border-soft-strong">
      <div className="container-max grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0.92, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <HugeiconsIcon
                  icon={ShieldUserIcon}
                  size={20}
                  className="text-primary"
                />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Ingestion Pipeline
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight mb-6 text-heading leading-[1.1]">
              The <span className="text-primary">Anomaly Engine.</span>
            </h2>
            <p className="text-body mb-10 text-lg font-body max-w-xl">
              Our ingestion pipeline analyzes every log line in real-time. By
              matching critical patterns and heartbeat timeouts, we eliminate
              the 15-minute gap typical of legacy monitoring.
            </p>

            <div className="space-y-6">
              {[
                {
                  title: "SEV1 Detection",
                  desc: "Instantly triggers on FATAL errors, Memory Leaks, or Heartbeat loss.",
                  color: "bg-danger",
                  icon: Alert01Icon,
                },
                {
                  title: "SEV2 Detection",
                  desc: "Flags slow queries, circuit breaker trips, and latency spikes.",
                  color: "bg-warning",
                  icon: DashboardSquare01Icon,
                },
              ].map((sev, i) => (
                <div
                  key={i}
                  className="flex gap-6 p-6 rounded-2xl border border-border-soft bg-surface-1/50 hover:bg-surface-1 hover:border-primary/20 transition-all group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div
                    className={`w-12 h-12 rounded-xl ${sev.color}/10 flex items-center justify-center shrink-0 relative z-10`}
                  >
                    <HugeiconsIcon
                      icon={sev.icon}
                      size={24}
                      className={sev.color.replace("bg-", "text-")}
                    />
                  </div>
                  <div className="relative z-10">
                    <h4 className="font-display font-bold text-heading uppercase tracking-tight mb-1">
                      {sev.title}
                    </h4>
                    <p className="text-sm text-body font-body leading-relaxed">
                      {sev.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 20 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Decorative Glow */}
          <div className="absolute -inset-10 bg-primary/10 blur-[120px] rounded-full opacity-50 -z-10" />

          <div className="glass-surface p-1 border-border-soft bg-surface-1 relative group rounded-card">
            <div className="relative bg-surface-2 p-8 rounded-[calc(var(--radius-card)-4px)] overflow-hidden min-h-[400px]">
              {/* Terminal Header */}
              <div className="flex items-center justify-between mb-8 border-b border-border-soft pb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/10 shadow-inner hover:brightness-110 transition-all cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/10 shadow-inner hover:brightness-110 transition-all cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/10 shadow-inner hover:brightness-110 transition-all cursor-pointer" />
                </div>
                <div className="flex items-center gap-3">
                  <HugeiconsIcon
                    icon={SourceCodeIcon}
                    size={16}
                    className="text-muted"
                  />
                  <div className="text-[10px] text-muted font-mono uppercase tracking-[0.2em] font-medium">
                    engine / analyzer.ts
                  </div>
                </div>
              </div>

              {/* Syntax Highlighted Code */}
              <pre className="font-mono text-sm leading-relaxed overflow-x-auto">
                <code className="grid gap-1">
                  <div className="flex gap-4">
                    <span className="text-muted/30 select-none w-4">01</span>
                    <span className="text-heading">
                      <span className="text-primary">export function</span>{" "}
                      analyze(log: <span className="text-accent">LogLine</span>){" "}
                      {"{"}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-muted/30 select-none w-4">02</span>
                    <span className="text-heading ml-4">
                      <span className="text-primary">const</span> patterns = [
                      <span className="text-success">'FATAL'</span>,{" "}
                      <span className="text-success">'OOM'</span>];
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-muted/30 select-none w-4">03</span>
                    <span className="text-heading ml-4"></span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-muted/30 select-none w-4">04</span>
                    <span className="text-heading ml-4">
                      <span className="text-primary">if</span> (patterns.some(p
                      ={">"} log.includes(p))) {"{"}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-muted/30 select-none w-4">05</span>
                    <span className="text-heading ml-8">
                      <span className="text-primary">return</span> emitAlert(
                      <span className="text-danger">'SEV1'</span>);
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-muted/30 select-none w-4">06</span>
                    <span className="text-heading ml-4">{"}"}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-muted/30 select-none w-4">07</span>
                    <span className="text-heading ml-4">
                      <span className="text-primary">return</span>{" "}
                      <span className="text-muted">null</span>;
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-muted/30 select-none w-4">08</span>
                    <span className="text-heading">{"}"}</span>
                  </div>
                </code>
              </pre>

              {/* Scanning Line Animation */}
              <motion.div
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-primary/10 to-transparent z-10 pointer-events-none"
              >
                <div className="h-px w-full bg-primary/40 shadow-[0_0_20px_var(--color-primary)]" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
