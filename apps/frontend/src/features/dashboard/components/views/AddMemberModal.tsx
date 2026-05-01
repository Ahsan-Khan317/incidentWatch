"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, UserPlus, Info } from "lucide-react";
import { TeamMember } from "../../types";

interface AddMemberModalProps {
  show: boolean;
  onClose: () => void;
  onAdd: (member: Omit<TeamMember, "id" | "status" | "avatarColor">) => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  show,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    expertise: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    onAdd({
      name: formData.name,
      role: formData.role || "Engineer",
      email: formData.email,
      expertise: formData.expertise
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== ""),
    });

    setFormData({ name: "", role: "", email: "", expertise: "" });
    onClose();
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-[#0c0c0e] border border-white/[0.08] rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-md text-primary border border-primary/20">
                  <UserPlus size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tight">
                    Add Engineer
                  </h3>
                  <p className="text-zinc-500 text-[11px] font-medium uppercase tracking-wider mt-1">
                    Command Center Onboarding
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 rounded-md hover:bg-white/[0.05] text-zinc-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <input
                    autoFocus
                    required
                    type="text"
                    placeholder="e.g. Marcus Thorne"
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-5 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                    Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SRE Lead"
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-5 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                  Work Email
                </label>
                <input
                  required
                  type="email"
                  placeholder="name@organization.com"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-5 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                  Expertise Tags
                </label>
                <input
                  type="text"
                  placeholder="AWS, Kubernetes, React (comma separated)"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-5 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                  value={formData.expertise}
                  onChange={(e) =>
                    setFormData({ ...formData, expertise: e.target.value })
                  }
                />
                <div className="flex items-center gap-2 mt-2 px-1">
                  <Info size={12} className="text-zinc-600" />
                  <p className="text-[9px] text-zinc-600 font-medium">
                    Tags help AI auto-route incidents to the most qualified
                    responder.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-white text-black py-4 rounded-md text-xs font-bold uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all shadow-xl shadow-white/5"
                >
                  Confirm Onboarding
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
