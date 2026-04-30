"use client";
import React from "react";
import { motion } from "framer-motion";

export const AnomalyEngine = () => {
  const codeSnippet = `function analyze(logLine) {
  const CRITICAL = ['OutOfMemoryError', 'FATAL', 'Deadlock'];
  const WARNING  = ['timeout', 'retry', 'slow query'];

  if (CRITICAL.some(k => logLine.includes(k))) return 'SEV1';
  if (WARNING.some(k => logLine.includes(k)))  return 'SEV2';
  return null;
}`;

  return (
    <section className="py-24 px-6 relative">
      <div className="container-max grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0.92, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              The <span className="text-primary">Anomaly Engine.</span>
            </h2>
            <p className="text-body mb-8 text-lg">
              Our ingestion pipeline analyzes every log line in real-time. By
              matching critical patterns and heartbeat timeouts, we eliminate
              the 15-minute gap typical of legacy monitoring.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-1 h-12 bg-danger rounded-full" />
                <div>
                  <h4 className="font-bold text-heading">SEV1 Detection</h4>
                  <p className="text-sm text-muted">
                    Instantly triggers on FATAL errors, Memory Leaks, or
                    Heartbeat loss.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1 h-12 bg-warning rounded-full" />
                <div>
                  <h4 className="font-bold text-heading">SEV2 Detection</h4>
                  <p className="text-sm text-muted">
                    Flags slow queries, circuit breaker trips, and latency
                    spikes.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0.94, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-surface p-1 border-neutral-200 bg-neutral-100 relative group shadow-md"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 to-accent/10 blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative bg-neutral-900 p-6 rounded-card overflow-hidden">
            <div className="flex items-center gap-2 mb-4 text-xs text-neutral-400 font-mono uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-primary" /> engine /
              analyzer.js
            </div>
            <pre className="font-mono text-sm leading-relaxed text-primary/90 overflow-x-auto">
              <code>{codeSnippet}</code>
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
