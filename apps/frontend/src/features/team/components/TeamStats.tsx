import React from "react";

const TeamStats = () => {
  const stats = [
    {
      label: "On-Call Primary",
      value: "Marcus Thorne",
      sub: "Shift ends in 4h 22m",
      tone: "primary",
    },
    {
      label: "Secondary",
      value: "Elena Rodriguez",
      sub: "Response time: 4.2m",
      tone: "neutral",
    },
    {
      label: "Avg Availability",
      value: "99.98%",
      sub: "↑ 0.02% vs last week",
      tone: "success",
    },
    {
      label: "Current Incident",
      value: "None",
      sub: "Stable operations",
      tone: "success",
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded border border-border bg-surface-1 p-6 shadow-sm"
        >
          <p className="text-[0.625rem] font-bold uppercase tracking-widest text-muted">
            {stat.label}
          </p>
          <div
            className={`mt-2 text-2xl font-bold tracking-tight ${stat.tone === "primary" ? "text-primary" : "text-heading"}`}
          >
            {stat.value}
          </div>
          <p
            className={`mt-1 text-xs ${stat.tone === "success" ? "text-success" : "text-body"}`}
          >
            {stat.sub}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TeamStats;
