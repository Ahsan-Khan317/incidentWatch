"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { useServiceStore } from "@/src/features/dashboard/store/service-store";
import { useViewStore } from "@/src/features/dashboard/store/view-store";
import { useServices } from "../../service/hooks/useServices";
import DashboardButton from "@/src/components/ui/DashboardButton";
import { useRouter } from "next/navigation";

const ServiceDropDown = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { selectedServiceId, setSelectedServiceId, services } =
    useServiceStore();
  const { setActiveView } = useViewStore();

  // Use our centralized hook which handles fetching and store syncing
  const servicesQuery = useServices();

  const resolvedSelectedService = useMemo(() => {
    if (selectedServiceId === "all" || !Array.isArray(services)) {
      return null;
    }
    return (
      services.find((s: any) => (s._id || s.id) === selectedServiceId) || null
    );
  }, [services, selectedServiceId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentName = resolvedSelectedService?.name || "All Infrastructure";
  const currentMeta = resolvedSelectedService?.environment || "Global Cluster";

  return (
    <div ref={menuRef} className="border-b border-border/40 px-4 py-4">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-none border border-border bg-surface-1 px-3 py-2.5 transition-all hover:border-primary/40 group"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none bg-primary text-[10px] font-bold text-black uppercase tracking-tighter">
            {resolvedSelectedService
              ? resolvedSelectedService.name.charAt(0)
              : "ALL"}
          </div>
          <div className="flex min-w-0 flex-col text-left">
            <span className="truncate text-[10px] font-bold uppercase tracking-widest text-heading">
              {currentName}
            </span>
            <span className="truncate text-[9px] text-zinc-500 uppercase font-medium">
              {currentMeta}
            </span>
          </div>
        </div>
        <ChevronDown
          size={14}
          className={`shrink-0 text-muted transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="mt-2 max-h-72 overflow-y-auto rounded-none border border-border bg-surface-2 p-1 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 scrollbar-hide">
          <button
            type="button"
            onClick={() => {
              setSelectedServiceId("all");
              setIsOpen(false);
            }}
            className={`flex w-full items-center justify-between rounded-none px-3 py-3 text-left transition-all ${
              selectedServiceId === "all"
                ? "bg-primary text-black font-bold"
                : "text-zinc-400 hover:bg-surface-3 hover:text-white"
            }`}
          >
            <span className="text-[10px] uppercase tracking-widest">
              All Services
            </span>
            <span className="text-[8px] uppercase tracking-tighter opacity-60">
              Global
            </span>
          </button>

          {Array.isArray(services) &&
            services.map((service: any) => {
              const id = service._id || service.id;
              const isSelected = selectedServiceId === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setSelectedServiceId(id);
                    setIsOpen(false);
                  }}
                  className={`mt-1 flex w-full items-center justify-between rounded-none px-3 py-3 text-left transition-all ${
                    isSelected
                      ? "bg-primary text-black font-bold"
                      : "text-zinc-400 hover:bg-surface-3 hover:text-white"
                  }`}
                >
                  <span className="min-w-0 truncate text-[10px] uppercase tracking-widest">
                    {service.name}
                  </span>
                  <span className="ml-2 truncate text-[8px] uppercase tracking-tighter opacity-60">
                    {service.environment}
                  </span>
                </button>
              );
            })}

          <div className="mt-2 p-1 border-t border-border/40">
            <button
              onClick={() => {
                setIsOpen(false);
                setActiveView("services");
              }}
              className="flex w-full items-center justify-center gap-2 px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5 transition-all"
            >
              <Plus size={12} />
              Manage Services
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDropDown;
