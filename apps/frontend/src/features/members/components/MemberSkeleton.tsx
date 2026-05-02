import React from "react";

const MemberSkeleton: React.FC = () => {
  return (
    <div className="relative bg-surface-1 border border-border p-5 overflow-hidden">
      {/* Tactical Glow Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />

      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="flex items-center gap-4 w-full">
          {/* Avatar Square */}
          <div className="h-12 w-12 bg-surface-2 border border-border flex-shrink-0 animate-pulse" />

          <div className="flex-1 space-y-2">
            {/* Name Line */}
            <div className="h-4 w-2/3 bg-surface-2 animate-pulse" />
            {/* Role Line */}
            <div className="h-2 w-1/3 bg-surface-2 opacity-60 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Expertise Tags */}
      <div className="mt-6 flex flex-wrap gap-1.5 relative z-10">
        <div className="h-4 w-12 bg-surface-2 border border-border animate-pulse" />
        <div className="h-4 w-16 bg-surface-2 border border-border animate-pulse" />
        <div className="h-4 w-10 bg-surface-2 border border-border animate-pulse" />
      </div>

      {/* Footer Actions */}
      <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-surface-2 animate-pulse" />
          <div className="h-2 w-16 bg-surface-2 animate-pulse" />
        </div>
        <div className="h-3 w-20 bg-surface-2/60 animate-pulse" />
      </div>
    </div>
  );
};

export default MemberSkeleton;
