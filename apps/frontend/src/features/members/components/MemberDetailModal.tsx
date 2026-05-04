"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Shield, Calendar, Activity, Zap } from "lucide-react";

interface MemberDetailModalProps {
  member: any;
  isOpen: boolean;
  onClose: () => void;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  member,
  isOpen,
  onClose,
}) => {
  if (!member) return null;

  const initials = member.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden border border-border bg-surface-1 shadow-2xl"
          >
            {/* Header / Banner */}
            <div className={`h-24 w-full opacity-20 ${member.avatarColor}`} />

            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-muted hover:text-heading transition-colors"
            >
              <X size={20} />
            </button>

            <div className="px-8 pb-8">
              {/* Profile Header */}
              <div className="relative -mt-12 mb-6 flex items-end gap-6">
                <div
                  className={`flex h-24 w-24 shrink-0 items-center justify-center border-4 border-surface-1 text-2xl font-black tracking-tighter ${member.avatarColor} shadow-xl`}
                >
                  {initials}
                </div>
                <div className="pb-1">
                  <h2 className="text-2xl font-black text-heading uppercase tracking-tight leading-none">
                    {member.name}
                  </h2>
                  <p className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    {member.role} • Tier {member.tier || 1}
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-surface-2 p-4 border border-border/50">
                  <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">
                    Status
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${member.status === "on-duty" ? "bg-success animate-pulse" : "bg-muted/30"}`}
                    />
                    <span className="text-xs font-bold text-heading uppercase">
                      {member.status === "on-duty"
                        ? "Tactical Duty"
                        : "Offline"}
                    </span>
                  </div>
                </div>
                <div className="bg-surface-2 p-4 border border-border/50">
                  <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">
                    Availability
                  </p>
                  <div className="flex items-center gap-2">
                    <Zap size={12} className="text-warning" />
                    <span className="text-xs font-bold text-heading uppercase">
                      High Response
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] border-b border-border pb-2">
                    Communications
                  </h4>
                  <div className="flex items-center gap-3 text-sm text-heading">
                    <Mail size={14} className="text-muted" />
                    <span className="font-mono text-xs">{member.email}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] border-b border-border pb-2">
                    Specialization Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {member.expertise?.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-surface-2 border border-border text-[9px] font-bold text-muted uppercase tracking-widest"
                      >
                        {tag}
                      </span>
                    ))}
                    {(!member.expertise || member.expertise.length === 0) && (
                      <span className="text-[9px] text-muted/40 uppercase italic">
                        No specialized tags
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] border-b border-border pb-2">
                    Operations Context
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold">
                      <span className="text-muted/60">Organization ID</span>
                      <span className="text-heading font-mono">
                        {member.id.substring(0, 12)}...
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold">
                      <span className="text-muted/60">Access Level</span>
                      <span className="text-heading">Level 4 Clearance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
