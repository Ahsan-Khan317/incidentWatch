import React from "react";
import { Activity, Cloud, PlusCircle, Webhook } from "lucide-react";

const IntegrationGrid = () => {
  const integrations = [
    {
      name: "Grafana Cloud",
      desc: "Bi-directional telemetry sync active.",
      icon: Activity,
      status: "Active",
      tone: "primary",
    },
    {
      name: "AWS S3",
      desc: "Automatic log rotation and cold storage.",
      icon: Cloud,
      status: "Connect",
      tone: "neutral",
    },
    {
      name: "Webhook API",
      desc: "Securely push data to any endpoint.",
      icon: Webhook,
      status: "Configured",
      tone: "neutral",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {integrations.map((item) => (
        <div
          key={item.name}
          className="group rounded border border-border bg-surface-1 p-4 transition-all hover:bg-surface-2 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <item.icon
              size={18}
              className="text-muted group-hover:text-primary transition-colors"
            />
            <h4 className="text-sm font-bold text-heading">{item.name}</h4>
          </div>
          <p className="mt-2 text-[0.6875rem] text-muted leading-relaxed">
            {item.desc}
          </p>
          <button
            className={`mt-4 text-[0.625rem] font-bold uppercase tracking-widest hover:underline ${
              item.tone === "primary"
                ? "text-primary"
                : "text-muted hover:text-heading"
            }`}
          >
            {item.status}
          </button>
        </div>
      ))}

      <div className="flex cursor-pointer flex-col items-center justify-center rounded border border-dashed border-border bg-primary/5 p-4 transition-all hover:bg-primary/10 group">
        <PlusCircle
          size={20}
          className="text-primary group-hover:scale-110 transition-transform"
        />
        <span className="mt-2 text-[0.625rem] font-bold uppercase tracking-widest text-primary">
          Browse Catalog
        </span>
      </div>
    </div>
  );
};

export default IntegrationGrid;
