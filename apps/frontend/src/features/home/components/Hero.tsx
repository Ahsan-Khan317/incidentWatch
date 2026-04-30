"use client";
import React from "react";
import { motion } from "framer-motion";

export const Hero = () => {
  const terminalLines = [
    "> npm install -g @incidentwatch/agent",
    "> incidentwatch-agent start --key=xyz... --id=prod-1",
    "> [INFO] Connected to IncidentWatch Ingestion API",
    "> [INFO] Heartbeat monitoring active (30s interval)",
    "> [INFO] Log stream tailing: /var/log/app.log",
    "> [OK] Monitoring live...",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.5,
      },
    },
  };

  const lineVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      <div className="container-max grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Content */}
        <motion.div
          initial={{ opacity: 0.92, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-display font-extrabold text-heading leading-[1.1] mb-6">
            Uptime is <span className="text-primary">Non-Negotiable.</span>
          </h1>
          <p className="text-lg text-body mb-8 max-w-lg">
            Detect incidents in under 30 seconds. AI-powered root cause
            analysis, automated team escalations, and real-time public status
            pages—all in one place.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary btn-lg">Start Monitoring Now</button>
            <button className="btn-outline btn-lg">View Demo</button>
          </div>
        </motion.div>

        {/* Right Side: Terminal Mockup */}
        <motion.div
          initial={{ opacity: 0.9, scale: 0.98, y: 12 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative group"
        >
          {/* Decorative Glow */}
          <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative glass-surface p-6 font-mono text-sm border border-neutral-200 rounded-xl shadow-lg bg-neutral-900/90">
            <div className="flex gap-2 mb-4 border-b border-white/10 pb-3">
              <div className="w-3 h-3 rounded-full bg-danger/70" />
              <div className="w-3 h-3 rounded-full bg-warning/70" />
              <div className="w-3 h-3 rounded-full bg-success/70" />
              <span className="ml-2 text-xs text-neutral-400">
                terminal — incidentwatch-agent
              </span>
            </div>

            <motion.div
              variants={containerVariants}
              initial={false}
              animate="visible"
              className="space-y-2"
            >
              {terminalLines.map((line, idx) => (
                <motion.p
                  key={idx}
                  variants={lineVariants}
                  className={
                    line.includes("[ERROR]")
                      ? "text-danger"
                      : line.includes("[INFO]")
                        ? "text-info"
                        : line.includes(">")
                          ? "text-primary"
                          : "text-body-strong"
                  }
                >
                  {line}
                </motion.p>
              ))}
              <motion.div
                animate={{ opacity: [0, 1] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="w-2 h-4 bg-primary inline-block align-middle"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Background Shapes */}
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-accent/5 blur-[100px] rounded-full" />
    </section>
  );
};
