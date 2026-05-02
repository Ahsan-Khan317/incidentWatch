"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield } from "lucide-react";
import { ServiceForm } from "./ServiceForm";
import { Service } from "../types";

interface CreateServiceModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Service | null;
  isLoading?: boolean;
  onCreated?: (message: string) => void;
}

export const CreateServiceModal: React.FC<CreateServiceModalProps> = ({
  show,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  if (!show) return null;

  return (
    <motion.section
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-8 border border-dashed border-border bg-surface-1 overflow-hidden"
      aria-labelledby="create-service-panel-title"
    >
      {/* Form Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h2
            id="create-service-panel-title"
            className="text-xs uppercase tracking-[0.15em] text-heading font-bold"
          >
            {initialData ? "Configure Infrastructure" : "System Integration"}
          </h2>
          <p className="mt-1 text-[10px] text-body uppercase tracking-wider">
            {initialData
              ? `Modifying ${initialData.name}`
              : "Define service parameters and auto-routing"}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 border border-border text-body hover:bg-surface-2 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <ServiceForm
          initialData={initialData}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </div>
    </motion.section>
  );
};
