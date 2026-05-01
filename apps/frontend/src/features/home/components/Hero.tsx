"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { IncidentSimulator } from "./IncidentSimulator/index";

export const Hero = () => {
  return (
    <section className="relative pt-40 md:pt-28 pb-10 px-6 overflow-hidden">
      <div className="container-max grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Side: Content */}
        <motion.div
          initial={{ opacity: 0.92, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="px-2 py-1 bg-primary/10 border border-primary/20 rounded text-[10px] font-bold text-primary uppercase tracking-widest">
              v1.0 Beta
            </div>
            <span className="text-[10px] text-muted font-bold uppercase tracking-widest">
              Available for AWS & Azure
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display uppercase font-extrabold text-heading leading-[0.9] mb-6">
            Downtime is <span className="text-primary">Unacceptable.</span>
          </h1>
          <p className="text-lg text-body mb-10 max-w-lg leading-relaxed">
            Detect incidents in under 30 seconds. AI-powered root cause
            analysis, automated team escalations, and real-time public status
            pages—all in one place.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard" className="btn btn-primary btn-lg px-10">
              <span className="btn-slide">
                <span>Start Monitoring</span>
                <span>Start Monitoring</span>
              </span>
            </Link>

            <button className="btn btn-outline btn-lg px-10">
              Book a Demo
            </button>
          </div>

          {/* Social Proof Placeholder */}
          <div className="mt-12 pt-12 border-t border-border-soft flex items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
              Trusted by
            </span>
            <div className="flex gap-8 items-center grayscale">
              <span className="text-lg font-bold text-heading">RAZOR</span>
              <span className="text-lg font-bold text-heading">NEXUS</span>
              <span className="text-lg font-bold text-heading">CLOUDFY</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Interactive Dashboard */}
        <motion.div
          key="hero-simulator"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative min-h-[400px] flex items-center justify-center"
        >
          <IncidentSimulator />
        </motion.div>
      </div>
    </section>
  );
};
