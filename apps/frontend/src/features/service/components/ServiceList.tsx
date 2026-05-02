"use client";
import React from "react";
import { ServiceCard } from "./ServiceCard";
import { Service } from "../types";
import { Search, Filter, Plus } from "lucide-react";

interface ServiceListProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

export const ServiceList: React.FC<ServiceListProps> = ({
  services,
  onEdit,
  onDelete,
  onCreate,
}) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-4 flex items-center text-muted pointer-events-none">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search systems and services..."
            className="w-full bg-surface-1 border border-border-soft rounded-md pl-12 pr-5 py-3 text-sm text-heading focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted/50"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-surface-1 border border-border-soft rounded-md text-xs font-bold text-muted uppercase tracking-wider hover:bg-surface-2 transition-all">
            <Filter size={16} />
            Filters
          </button>
          <button
            onClick={onCreate}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-md text-xs font-bold uppercase tracking-[0.15em] hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
          >
            <Plus size={16} />
            Deploy Service
          </button>
        </div>
      </div>

      {!Array.isArray(services) ? (
        <div className="text-center py-24 border border-dashed border-danger/20 rounded-md bg-danger/5">
          <p className="text-sm text-danger font-medium">
            Invalid service data received. Please try again.
          </p>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border-soft rounded-md bg-surface-1/30">
          <div className="max-w-xs mx-auto space-y-4">
            <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mx-auto text-muted mb-6">
              <Plus size={32} />
            </div>
            <h3 className="text-xl font-display font-bold text-heading uppercase tracking-tight">
              No Services Active
            </h3>
            <p className="text-sm text-zinc-500">
              Deploy your first service to start monitoring and auto-routing
              incidents.
            </p>
            <button
              onClick={onCreate}
              className="mt-4 text-primary text-xs font-bold uppercase tracking-widest hover:underline"
            >
              Get Started Now
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
