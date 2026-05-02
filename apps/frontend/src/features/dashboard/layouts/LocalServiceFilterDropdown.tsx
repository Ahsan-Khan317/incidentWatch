"use client";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { useServiceStore } from "@/src/features/dashboard/store/service-store";

const LocalServiceFilterDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { services, selectedServiceId, setSelectedServiceId } =
    useServiceStore();

  const selectedService = useMemo(() => {
    if (selectedServiceId === "all" || !Array.isArray(services)) return null;
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

  const displayName =
    selectedServiceId === "all"
      ? "All Services"
      : selectedService?.name || "Select Service";

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-none border border-border bg-surface-1 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-heading transition-all hover:border-primary/40"
      >
        <Filter size={12} className="text-primary" />
        <span>{displayName}</span>
        <ChevronDown
          size={12}
          className={`ml-1 text-muted transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-[100] mt-2 max-h-64 w-64 overflow-y-auto rounded-none border border-border bg-surface-2 p-1 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 scrollbar-hide">
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

          <div className="my-1 border-t border-border/40" />

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
                  <span className="truncate text-[10px] uppercase tracking-widest">
                    {service.name}
                  </span>
                  <span className="ml-2 text-[8px] uppercase tracking-tighter opacity-60">
                    {service.environment}
                  </span>
                </button>
              );
            })}

          {(!services || services.length === 0) && (
            <div className="px-3 py-4 text-[9px] text-zinc-500 uppercase tracking-widest text-center italic">
              No active services found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocalServiceFilterDropdown;
