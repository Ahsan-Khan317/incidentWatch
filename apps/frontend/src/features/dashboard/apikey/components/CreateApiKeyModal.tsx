"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Key, Info, Clock, Infinity as InfinityIcon } from "lucide-react";
import { CreateApiKeyRequest } from "../types/apiKey.types";

interface CreateApiKeyModalProps {
  show: boolean;
  onClose: () => void;
  onAdd: (data: CreateApiKeyRequest) => Promise<void>;
}

const EXPIRY_OPTIONS = [
  { label: "7 Days", value: "7" },
  { label: "30 Days", value: "30" },
  { label: "90 Days", value: "90" },
  { label: "Infinite", value: "infinite" },
];

export const CreateApiKeyModal: React.FC<CreateApiKeyModalProps> = ({
  show,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("infinite");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      let expiresAt: string | undefined = undefined;
      if (expiry !== "infinite") {
        const date = new Date();
        date.setDate(date.getDate() + parseInt(expiry));
        expiresAt = date.toISOString();
      }

      await onAdd({ name, expiresAt });
      setName("");
      setExpiry("infinite");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create API key");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-page/80 backdrop-blur-sm z-[100] cursor-crosshair"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-surface-0 border border-border-soft rounded-lg shadow-2xl z-[101] overflow-hidden"
          >
            <div className="p-6 border-b border-border-soft flex items-center justify-between bg-surface-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-soft rounded-md flex items-center justify-center text-primary border border-primary/20">
                  <Key size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-heading">
                    New API Access Key
                  </h3>
                  <p className="text-[10px] text-muted uppercase font-black tracking-widest mt-0.5">
                    Security Configuration
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-muted hover:text-heading hover:bg-surface-2 rounded-md transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted">
                    Key Identifier Name
                  </label>
                  <input
                    autoFocus
                    className="w-full bg-surface-2 border border-border-soft rounded-md px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all text-heading placeholder:text-muted/50"
                    placeholder="e.g. Production Webhook, Grafana Sync"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted">
                    Expiration Period
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {EXPIRY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setExpiry(opt.value)}
                        className={`flex items-center justify-between px-4 py-3 rounded-md border text-[11px] font-bold transition-all ${
                          expiry === opt.value
                            ? "bg-primary-soft border-primary text-primary shadow-inner"
                            : "bg-surface-2 border-border-soft text-muted hover:border-border hover:bg-surface-3"
                        }`}
                      >
                        {opt.label}
                        {opt.value === "infinite" ? (
                          <InfinityIcon
                            size={14}
                            className={
                              expiry === opt.value
                                ? "text-primary"
                                : "text-muted/50"
                            }
                          />
                        ) : (
                          <Clock
                            size={14}
                            className={
                              expiry === opt.value
                                ? "text-primary"
                                : "text-muted/50"
                            }
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-primary-soft/30 border border-primary/10 rounded-md flex gap-3">
                  <Info className="text-primary shrink-0 mt-0.5" size={16} />
                  <p className="text-[11px] text-muted leading-relaxed">
                    {expiry === "infinite"
                      ? "This key will never expire. Use it for critical production infrastructure where periodic rotation is manually managed."
                      : `This key will automatically stop working in ${expiry} days. Recommended for temporary integrations.`}
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-danger-soft border border-danger/20 rounded-md text-danger text-[11px] font-bold">
                    {error}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-border-soft text-xs font-bold text-muted hover:text-heading hover:bg-surface-1 rounded-md transition-all uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !name.trim()}
                  className="flex-1 py-3 bg-primary text-on-primary text-xs font-bold rounded-md hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-widest shadow-lg shadow-primary/20"
                >
                  {isLoading ? "Generating..." : "Generate Key"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
