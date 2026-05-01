"use client";
import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  sub,
  icon: Icon,
  color,
}) => (
  <div className="bg-surface-1 border border-border-soft rounded-md p-8 group hover:border-border transition-all duration-300 transition-colors">
    <div className="flex items-center justify-between mb-8">
      <div className="w-10 h-10 rounded-md bg-surface-2 border border-border-soft flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon size={20} className={color} />
      </div>
      <span className="text-[9px] font-bold text-muted uppercase tracking-[0.25em]">
        {title}
      </span>
    </div>
    <div className="space-y-1">
      <h4 className="text-3xl font-display font-bold text-heading uppercase tracking-tight">
        {value}
      </h4>
      <p className="text-[11px] text-muted font-medium font-body">{sub}</p>
    </div>
  </div>
);
