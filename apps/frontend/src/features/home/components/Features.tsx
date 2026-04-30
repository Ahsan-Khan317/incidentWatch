"use client";
import React from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Users, BarChart3, Bell, Brain } from "lucide-react";

const featureList = [
  {
    title: "AI Root Cause Analysis",
    description:
      "Claude-powered log analysis gives you the probable cause and fix recommendations in seconds.",
    icon: Brain,
    accent: "text-primary",
  },
  {
    title: "Auto-Assign by Expertise",
    description:
      "Smartly routes incidents to the right engineer based on their technical tags (DB, AWS, Frontend).",
    icon: Users,
    accent: "text-info",
  },
  {
    title: "3-Minute Auto-Escalation",
    description:
      "Ensures critical issues aren't missed. If not acknowledged, it automatically notifies the next on-call.",
    icon: Zap,
    accent: "text-warning",
  },
  {
    title: "One-Click Postmortems",
    description:
      "Generates professional markdown postmortems from incident timelines automatically.",
    icon: BarChart3,
    accent: "text-success",
  },
  {
    title: "Real-Time Status Page",
    description:
      "Keep users informed with a public dashboard that updates as soon as incidents are resolved.",
    icon: Shield,
    accent: "text-primary",
  },
  {
    title: "Instant Notifications",
    description:
      "Multi-channel alerts via Slack, Email, and SMS with customizable severity rules.",
    icon: Bell,
    accent: "text-danger",
  },
];

export const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section id="features" className="py-24 px-6 relative">
      <div className="container-max">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0.92, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold mb-4"
          >
            Built for <span className="text-primary">Reliability.</span>
          </motion.h2>
          <p className="text-body max-w-2xl mx-auto">
            A comprehensive suite of tools to manage the full incident
            lifecycle, from detection to documentation.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial={false}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {featureList.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="card-surface p-8 group hover:border-primary/30 transition-all duration-300"
            >
              <div
                className={`w-12 h-12 rounded-lg bg-surface-2 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors`}
              >
                <feature.icon className={`w-6 h-6 ${feature.accent}`} />
              </div>
              <h3 className="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-body text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
