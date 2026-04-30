"use client";
import React from "react";
import { motion } from "framer-motion";
import { Building2, UserPlus, MessageSquareCode } from "lucide-react";

const steps = [
  {
    title: "1. Enroll Organization",
    description:
      "Register your company and add your production websites. Get unique API keys for your infrastructure.",
    icon: Building2,
  },
  {
    title: "2. Invite Engineers",
    description:
      "Add your team members and tag them with their expertise (Postgres, React, AWS) for smart routing.",
    icon: UserPlus,
  },
  {
    title: "3. Resolve Together",
    description:
      "When incidents strike, the system pings the right expert instantly. Collaborate on a shared timeline.",
    icon: MessageSquareCode,
  },
];

export const OrganizationFlow = () => {
  return (
    <section
      id="workflow"
      className="py-24 px-6 bg-surface-0/50 relative overflow-hidden"
    >
      <div className="container-max relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0.92, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold mb-4"
          >
            Scale with <span className="text-primary">Collaboration.</span>
          </motion.h2>
          <p className="text-body max-w-2xl mx-auto">
            From solo founders to enterprise engineering teams—IncidentWatch
            scales with your organization.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0.94, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative text-center group"
            >
              {/* Connector Line (Desktop) */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-[2px] bg-gradient-to-r from-primary/30 to-transparent -z-10" />
              )}

              <div className="w-20 h-20 bg-surface-1 border border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-soft group-hover:shadow-primary/20 group-hover:border-primary/20 transition-all duration-500">
                <step.icon className="w-10 h-10 text-primary" />
              </div>

              <h3 className="text-2xl font-display font-bold mb-4">
                {step.title}
              </h3>
              <p className="text-body text-sm leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative Background Mesh */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--color-primary-soft)_0%,transparent_70%)]" />
      </div>
    </section>
  );
};
