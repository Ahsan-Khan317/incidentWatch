"use client";
import React from "react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { OrganizationFlow } from "../components/OrganizationFlow";
import { DynamicBackground } from "../components/DynamicBackground";
import { AnomalyEngine } from "../components/AnomalyEngine";
import { Integrations } from "../components/Integrations";
import { motion } from "framer-motion";
import { LogoMarquee } from "../components/Marquee";

export const Landing = () => {
  return (
    <div className="min-h-screen bg-transparent text-body font-body selection:bg-primary/10 selection:text-heading overflow-x-hidden relative">
      <DynamicBackground />
      <Navbar />

      <main>
        <Hero />

        {/* Trusted By Section (Social Proof) */}
        <LogoMarquee />

        <Features />

        <AnomalyEngine />

        <OrganizationFlow />

        <Integrations />

        {/* Final CTA */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="container-md glass-surface p-12 text-center border border-primary/10 relative z-10 bg-white/40 dark:bg-neutral-900/40 shadow-soft">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Ready to eliminate <span className="text-primary">downtime?</span>
            </h2>
            <p className="text-lg text-body mb-10 max-w-xl mx-auto">
              Join 500+ engineering teams using IncidentWatch to build more
              resilient infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="btn-primary btn-lg">
                Create Free Organization
              </button>
              <button className="btn-outline btn-lg">Contact Sales</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t border-neutral-200 dark:border-white/10 bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-md">
        <div className="container-max grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-primary rounded-md" />
              <span className="font-display font-bold text-lg tracking-tight text-heading">
                IncidentWatch
              </span>
            </div>
            <p className="text-sm text-body max-w-xs">
              The mission-critical incident response platform for modern
              engineering teams. Built for speed, reliability, and
              collaboration.
            </p>
          </div>
          <div>
            <h4 className="font-display font-bold mb-6 text-heading">
              Product
            </h4>
            <ul className="space-y-4 text-sm text-body/70">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  SDK / CLI
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold mb-6 text-heading">
              Company
            </h4>
            <ul className="space-y-4 text-sm text-body/70">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="container-max border-t border-neutral-200 dark:border-white/10 pt-8 flex justify-between items-center text-xs text-body/50">
          <p>© 2026 IncidentWatch Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
