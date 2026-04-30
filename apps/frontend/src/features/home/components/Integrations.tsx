"use client";
import React from "react";
import { motion } from "framer-motion";

const techs = [
  { name: "Node.js", category: "Backend" },
  { name: "Python", category: "Backend" },
  { name: "Java", category: "Backend" },
  { name: "Docker", category: "Infrastructure" },
  { name: "Kubernetes", category: "Infrastructure" },
  { name: "Nginx", category: "Web Server" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Redis", category: "Caching" },
];

export const Integrations = () => {
  return (
    <section className="py-24 px-6 border-t border-white/5">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Integrate with your{" "}
            <span className="text-primary">entire stack.</span>
          </h2>
          <p className="text-body max-w-xl mx-auto">
            The lightweight agent tails logs and collects metrics from any
            source, ensuring full visibility across your infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {techs.map((tech, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5, backgroundColor: "rgba(22, 163, 74, 0.05)" }}
              className="glass-surface p-6 text-center border-white/5 transition-colors cursor-default"
            >
              <div className="text-xs text-primary mb-2 font-mono uppercase tracking-widest">
                {tech.category}
              </div>
              <div className="font-display font-bold text-heading text-lg">
                {tech.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
