"use client";
import React from "react";
import { motion } from "framer-motion";

interface ConfigCardProps {
  title: string;
  desc: string;
  enabled: boolean;
}

export const ConfigCard: React.FC<ConfigCardProps> = ({
  title,
  desc,
  enabled,
}) => (
  <div className="p-8 glass-surface bg-surface-1 border border-border-soft rounded-md flex items-center justify-between gap-8 group hover:border-primary/20 transition-all">
    <div className="flex-1">
      <h4 className="text-lg font-bold text-heading flex items-center gap-3">
        {title}
        {enabled && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-md bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-md h-2 w-2 bg-primary"></span>
          </span>
        )}
      </h4>
      <p className="text-sm text-muted mt-2 leading-relaxed font-body">
        {desc}
      </p>
    </div>
    <button
      className={`w-14 h-7 rounded-md relative transition-all duration-500 flex-shrink-0 ${enabled ? "bg-primary shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.4)]" : "bg-surface-3"}`}
    >
      <motion.div
        animate={{ x: enabled ? 30 : 4 }}
        className="absolute top-1 w-5 h-5 bg-white rounded-md shadow-md"
      />
    </button>
  </div>
);
