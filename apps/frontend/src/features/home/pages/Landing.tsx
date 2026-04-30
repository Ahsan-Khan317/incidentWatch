"use client";
import React from "react";
import { Navbar } from "../../../components/layouts/Navbar/Navbar";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { OrganizationFlow } from "../components/OrganizationFlow";
import { DynamicBackground } from "../components/DynamicBackground";
import { AnomalyEngine } from "../components/AnomalyEngine";
import { Integrations } from "../components/Integrations";
import { motion } from "framer-motion";
import Marquee from "../components/Marquee";
import { Footer } from "../../../components/layouts/footer/Footer";

export const Landing = () => {
  return (
    <div className="min-h-screen bg-transparent text-body font-body selection:bg-primary/10 selection:text-heading overflow-x-hidden relative">
      {/* <DynamicBackground /> */}
      <Navbar />

      <main>
        <Hero />

        {/* Trusted By Section (Social Proof) */}
        <Marquee />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Features />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <AnomalyEngine />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <OrganizationFlow />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Integrations />
        </motion.div>

        {/* Final CTA */}
        <section className="py-32 px-6 relative overflow-hidden border-t border-dashed border-border-soft">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-primary-soft)_0%,transparent_70%)] opacity-30 -z-10" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="container-md glass-surface p-12 md:p-20 text-center border border-border-soft relative z-10 bg-surface-1 rounded-3xl shadow-soft"
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tight mb-6 text-heading">
              Ready to eliminate <span className="text-primary">downtime?</span>
            </h2>
            <p className="text-lg text-body mb-12 max-w-xl mx-auto font-body">
              Join 500+ engineering teams using IncidentWatch to build more
              resilient infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button className="btn-primary btn-lg px-12">
                Create Free Organization
              </button>
              <button className="btn-outline btn-lg px-12">
                Contact Sales
              </button>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
