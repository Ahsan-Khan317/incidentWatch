"use client";

import { motion } from "framer-motion";

export function LogoMarquee() {
  const logos = [
    "Vercel",
    "Railway",
    "Supabase",
    "Redis",
    "Github",
    "AWS",
    "GCP",
    "Azure",
    "Docker",
    "Kubernetes",
  ];

  return (
    <section className="py-12 border-y border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-neutral-900/50 backdrop-blur-sm overflow-hidden">
      <div className="relative">
        <motion.div
          className="flex gap-12 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {/* First set */}
          {logos.map((name, i) => (
            <div
              key={`first-${i}`}
              className="font-display font-black text-2xl tracking-tighter italic text-heading whitespace-nowrap opacity-40 hover:opacity-100 hover:scale-110 transition-all duration-300 flex-shrink-0"
            >
              {name}
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {logos.map((name, i) => (
            <div
              key={`second-${i}`}
              className="font-display font-black text-2xl tracking-tighter italic text-heading whitespace-nowrap opacity-40 hover:opacity-100 hover:scale-110 transition-all duration-300 flex-shrink-0"
            >
              {name}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
