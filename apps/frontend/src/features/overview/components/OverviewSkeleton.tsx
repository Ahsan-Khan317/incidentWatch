"use client";

import React from "react";
import Container from "@/src/components/dashboard/common/Container";
import SectionHeading from "@/src/components/dashboard/common/SectionHeading";

const OverviewSkeleton: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Metric Cards Skeleton */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded border border-border bg-surface-1 p-6 shadow-sm"
          >
            <div className="skeleton h-3 w-20 mb-3" />
            <div className="skeleton h-8 w-32 mb-2" />
            <div className="skeleton h-3 w-40" />
          </div>
        ))}
      </div>

      {/* Content Area Skeleton */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded border border-dashed border-border bg-page p-4">
          <div className="mb-4">
            <div className="skeleton h-4 w-32 mb-2" />
            <div className="skeleton h-3 w-64" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded border border-border bg-surface-2 p-4 h-40">
              <div className="skeleton h-3 w-24 mb-3" />
              <div className="skeleton h-10 w-20 mb-4" />
              <div className="skeleton h-3 w-32" />
            </div>
            <div className="rounded border border-border bg-surface-2 p-4 h-40">
              <div className="skeleton h-3 w-24 mb-3" />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="skeleton h-3 w-20" />
                  <div className="skeleton h-3 w-8" />
                </div>
                <div className="flex justify-between">
                  <div className="skeleton h-3 w-24" />
                  <div className="skeleton h-3 w-10" />
                </div>
                <div className="flex justify-between">
                  <div className="skeleton h-3 w-20" />
                  <div className="skeleton h-3 w-12" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded border border-dashed border-border bg-page p-4">
          <div className="mb-4">
            <div className="skeleton h-4 w-32 mb-2" />
            <div className="skeleton h-3 w-64" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2 border-b border-border/50"
              >
                <div className="skeleton h-6 w-6 rounded" />
                <div className="flex-1 space-y-1">
                  <div className="skeleton h-3 w-24" />
                  <div className="skeleton h-2 w-40" />
                </div>
                <div className="skeleton h-4 w-8" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewSkeleton;
