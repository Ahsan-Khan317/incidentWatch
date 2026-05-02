"use client";

import React from "react";
import Container from "@/src/components/dashboard/common/Container";

const IncidentsSkeleton: React.FC = () => {
  return (
    <Container className="animate-fade-in space-y-8">
      <div className="px-1">
        <div className="skeleton h-8 w-64 mb-2" />
        <div className="skeleton h-4 w-48" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded border border-border bg-surface-1 p-6 h-48"
          >
            <div className="flex justify-between mb-4">
              <div className="skeleton h-4 w-24" />
              <div className="skeleton h-4 w-12" />
            </div>
            <div className="skeleton h-10 w-full mb-4" />
            <div className="flex gap-2">
              <div className="skeleton h-3 w-12" />
              <div className="skeleton h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default IncidentsSkeleton;
