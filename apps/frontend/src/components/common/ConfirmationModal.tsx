"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import DashboardButton from "@/src/components/ui/DashboardButton";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  tone?: "danger" | "warning" | "primary";
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  tone = "danger",
}) => {
  const toneClasses = {
    danger: "border-danger-border bg-danger-soft text-danger",
    warning: "border-warning-border bg-warning-soft text-warning",
    primary: "border-primary/30 bg-primary/10 text-primary",
  };

  const buttonVariants = {
    danger: "bg-danger hover:bg-rose-600 text-white",
    warning: "bg-warning hover:bg-amber-600 text-white",
    primary: "bg-primary hover:bg-primary-hover text-black",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-none border border-border bg-surface-1 shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center border ${toneClasses[tone]}`}
                >
                  <AlertTriangle size={20} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-heading tracking-tight">
                      {title}
                    </h3>
                    <button
                      onClick={onClose}
                      className="text-muted hover:text-heading transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-body leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end gap-3 border-t border-border/40 pt-6">
                <DashboardButton
                  variant="secondary"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-6 border-border/60"
                >
                  {cancelText}
                </DashboardButton>

                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`flex h-10 items-center justify-center px-6 text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed ${buttonVariants[tone]}`}
                >
                  {isLoading ? (
                    <div className="mr-2 h-3 w-3 animate-spin border-2 border-current border-t-transparent rounded-full" />
                  ) : null}
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
