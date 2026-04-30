"use client";
import React from "react";
import { View } from "./types";

interface TopbarProps {
  view: View;
  clock: string;
}

export const Topbar: React.FC<TopbarProps> = ({ view, clock }) => {
  return (
    <header className="h-12 border-b border-border-soft bg-surface-1/50 backdrop-blur-md flex items-center justify-between px-4 md:px-6 shrink-0">
      <h2 className="text-[10px] md:text-xs font-bold text-heading uppercase tracking-widest truncate mr-2">
        {view}
      </h2>
      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-success/10 rounded-full border border-success/20">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[8px] md:text-[10px] font-bold text-success uppercase whitespace-nowrap">
            Systems OK
          </span>
        </div>
        <span className="text-[9px] md:text-[10px] font-mono text-muted hidden sm:inline">
          {clock}
        </span>
      </div>
    </header>
  );
};
