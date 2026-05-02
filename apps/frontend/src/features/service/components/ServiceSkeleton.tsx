"use client";
import React from "react";

export const ServiceSkeleton: React.FC = () => {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <tr key={i} className="border-b border-border/60 last:border-b-0">
          <td className="px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="skeleton h-8 w-8 rounded-none" />
              <div className="space-y-2">
                <div className="skeleton h-3 w-32" />
                <div className="skeleton h-2 w-20" />
              </div>
            </div>
          </td>
          <td className="px-4 py-4">
            <div className="skeleton h-3 w-20" />
          </td>
          <td className="px-4 py-4">
            <div className="skeleton h-6 w-16" />
          </td>
          <td className="px-4 py-4">
            <div className="skeleton h-3 w-24" />
          </td>
          <td className="px-4 py-4">
            <div className="flex justify-end gap-2">
              <div className="skeleton h-8 w-20" />
              <div className="skeleton h-8 w-8" />
              <div className="skeleton h-8 w-8" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};
