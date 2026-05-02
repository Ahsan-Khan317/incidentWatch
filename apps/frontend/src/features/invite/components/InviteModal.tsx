"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Palette, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const COLORS = [
  "bg-blue-500/10 text-blue-500",
  "bg-emerald-500/10 text-emerald-500",
  "bg-purple-500/10 text-purple-500",
  "bg-amber-500/10 text-amber-500",
  "bg-rose-500/10 text-rose-500",
  "bg-indigo-500/10 text-indigo-500",
];

const inviteSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  expertise: z.string().optional(),
  tier: z.number().min(1).max(3),
  avatarColor: z.string(),
});

interface InviteModalProps {
  show: boolean;
  onClose: () => void;
  onInvite: (data: any) => Promise<boolean>;
  isLoading?: boolean;
}

export const InviteModal: React.FC<InviteModalProps> = ({
  show,
  onClose,
  onInvite,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      role: "",
      expertise: "",
      tier: 1,
      avatarColor: COLORS[0],
    },
  });

  const selectedColor = watch("avatarColor");

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      expertise: data.expertise
        ? data.expertise
            .split(",")
            .map((s: string) => s.trim())
            .filter((s: string) => s !== "")
        : [],
    };

    const success = await onInvite(payload);
    if (success) {
      reset();
    }
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
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-surface-0 border border-border rounded-none p-10 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-none text-primary border border-primary/20">
                  <UserPlus size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                    Invite member
                  </h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                    System Access Authorization
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-none hover:bg-surface-2 text-muted transition-colors border border-transparent hover:border-border"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 relative z-10"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">
                    Work Email
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="name@organization.com"
                    className={`w-full bg-surface-1 border ${errors.email ? "border-danger/50" : "border-border"} rounded-none px-4 py-3 text-sm text-heading focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted/30`}
                  />
                  {errors.email && (
                    <p className="text-[10px] text-danger mt-1 font-bold uppercase tracking-tight">
                      {errors.email.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">
                    Access Role
                  </label>
                  <select
                    {...register("role")}
                    className={`w-full bg-surface-1 border ${errors.role ? "border-danger/50" : "border-border"} rounded-none px-4 py-3 text-sm text-heading focus:outline-none focus:border-primary/50 transition-all cursor-pointer appearance-none`}
                  >
                    <option value="" disabled>
                      Select Role
                    </option>
                    <option value="developer">Active Developer</option>
                    <option value="admin">System Administrator</option>
                    <option value="tester">Field Tester</option>
                    <option value="viewer">Tactical Viewer</option>
                  </select>
                  {errors.role && (
                    <p className="text-[10px] text-danger mt-1 font-bold uppercase tracking-tight">
                      {errors.role.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">
                    Response Tier
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setValue("tier", t)}
                        className={`py-2 px-3 border text-[10px] font-bold uppercase tracking-widest transition-all ${
                          watch("tier") === t
                            ? "bg-primary border-primary text-black"
                            : "bg-surface-1 border-border text-muted hover:border-muted"
                        }`}
                      >
                        Tier {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                    <Palette size={10} /> Profile Theme
                  </label>
                  <div className="flex gap-2 p-1 bg-surface-1 border border-border">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setValue("avatarColor", color)}
                        className={`h-6 w-6 border-2 transition-all ${
                          selectedColor === color
                            ? "border-white scale-110"
                            : "border-transparent"
                        } ${color.split(" ")[0]}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">
                  Expertise Tags
                </label>
                <input
                  {...register("expertise")}
                  type="text"
                  placeholder="AWS, Kubernetes, React"
                  className="w-full bg-surface-1 border border-border rounded-none px-4 py-3 text-sm text-heading focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted/30"
                />
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-black py-4 rounded-none text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-primary/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Synchronizing..." : "Dispatch Invitation"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
