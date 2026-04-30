"use client";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const DynamicBackground = () => {
  const { scrollYProgress } = useScroll();

  // Robust transforms for highly visible movement
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 800]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -600]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  // Even subtler, professionally dimmed colors
  const color1 = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    [
      "rgba(34, 197, 94, 0.3)", // Vibrant Emerald Green
      "rgba(245, 158, 11, 0.3)", // Vibrant Amber
      "rgba(59, 130, 246, 0.3)", // Vibrant Blue
      "rgba(34, 197, 94, 0.3)", // Green Loop
    ],
  );

  return (
    <div className="fixed inset-0 -z-30 pointer-events-none overflow-hidden">
      {/* The actual background color layer — now theme aware */}
      <div className="absolute inset-0 bg-page transition-colors duration-500" />

      {/* Primary Animated Orb — Increased opacity for more vibrancy */}
      <motion.div
        style={{
          y: y1,
          rotate,
          backgroundColor: color1,
        }}
        className="absolute -top-[10%] -left-[10%] w-[80vw] h-[80vw] rounded-full blur-[140px] opacity-20 dark:opacity-30"
      />

      {/* Secondary Animated Orb — Increased opacity */}
      <motion.div
        style={{
          y: y2,
          rotate: -rotate,
        }}
        className="absolute top-[40%] -right-[10%] w-[60vw] h-[60vw] bg-primary/20 rounded-full blur-[120px] opacity-100"
      />

      {/* Grid Overlay — Slightly more visible for texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-primary-soft)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-primary-soft)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_60%,transparent_100%)] opacity-20" />
    </div>
  );
};
