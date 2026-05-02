"use client";

import { useServiceStore } from "@/src/features/dashboard/store/service-store";
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const LocalServiceFilterDropdown = ({
  value,
  onChange,
  disabled = false,
  allOptionLabel = "All Services",
  allOptionValue = "all",
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { services, servicesLoading, servicesError } = useServiceStore();
  const isAllSelected = value === allOptionValue;

  const selectedService = useMemo(() => {
    if (!value || isAllSelected) return null;
    return (
      services.find((service: any) => (service._id || service.id) === value) ??
      null
    );
  }, [services, value, isAllSelected]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current || menuRef.current.contains(event.target as Node)) {
        return;
      }
      setIsOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const displayName = isAllSelected
    ? allOptionLabel
    : selectedService?.name || "Select service";

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={disabled || servicesLoading}
        className="flex items-center gap-2 rounded border border-border bg-surface-1 px-3 py-1.5 text-[0.6875rem] text-body transition-colors hover:bg-white/5 disabled:opacity-50"
      >
        <span className="text-body uppercase tracking-widest mr-1">Filter</span>
        <span className="text-heading font-medium">{displayName}</span>
        <ChevronDown size={12} className="ml-1" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 max-h-64 w-56 overflow-auto rounded border border-border bg-surface-2 p-1 shadow-xl">
          <button
            type="button"
            onClick={() => {
              onChange(allOptionValue);
              setIsOpen(false);
            }}
            className={`flex w-full items-center justify-between rounded px-2 py-2 text-left text-xs transition-colors ${
              isAllSelected
                ? "bg-white/10 text-heading"
                : "text-body hover:bg-white/5 hover:text-heading"
            }`}
          >
            {allOptionLabel}
          </button>

          <div className="my-1 border-t border-border/50" />

          {services.map((service: any) => {
            const serviceId = service?._id || service?.id;
            const isSelected = value === serviceId;

            return (
              <button
                key={serviceId}
                type="button"
                onClick={() => {
                  onChange(serviceId);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded px-2 py-2 text-left text-xs transition-colors ${
                  isSelected
                    ? "bg-white/10 text-heading"
                    : "text-body hover:bg-white/5 hover:text-heading"
                }`}
              >
                {service?.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LocalServiceFilterDropdown;
