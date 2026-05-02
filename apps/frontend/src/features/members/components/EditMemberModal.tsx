"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Palette, Layers, Cpu, Save, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const editMemberSchema = z.object({
  role: z.enum(["admin", "developer", "tester", "viewer"]),
  tier: z.number().min(1).max(3),
  expertise: z.array(z.string()),
  avatarColor: z.string(),
});

type EditMemberForm = z.infer<typeof editMemberSchema>;

interface EditMemberModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (data: EditMemberForm) => void;
  member: any;
}

const TIER_OPTIONS = [
  { value: 1, label: "T1: Response", desc: "Primary on-call & triage" },
  { value: 2, label: "T2: Engineering", desc: "Complex system resolution" },
  { value: 3, label: "T3: Architecture", desc: "Deep infrastructure expert" },
];

const THEME_OPTIONS = [
  { value: "bg-blue-500/10 text-blue-500", label: "Cobalt", color: "#3b82f6" },
  {
    value: "bg-emerald-500/10 text-emerald-500",
    label: "Emerald",
    color: "#10b981",
  },
  { value: "bg-amber-500/10 text-amber-500", label: "Amber", color: "#f59e0b" },
  { value: "bg-rose-500/10 text-rose-500", label: "Crimson", color: "#f43f5e" },
  {
    value: "bg-violet-500/10 text-violet-500",
    label: "Violet",
    color: "#8b5cf6",
  },
];

export const EditMemberModal: React.FC<EditMemberModalProps> = ({
  show,
  onClose,
  onSave,
  member,
}) => {
  const [tagInput, setTagInput] = React.useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EditMemberForm>({
    resolver: zodResolver(editMemberSchema),
    defaultValues: {
      role: "viewer",
      tier: 1,
      expertise: [],
      avatarColor: THEME_OPTIONS[0].value,
    },
  });

  React.useEffect(() => {
    if (member) {
      reset({
        role: member.role || "viewer",
        tier: member.tier || 1,
        expertise: member.expertise || [],
        avatarColor: member.avatarColor || THEME_OPTIONS[0].value,
      });
    }
  }, [member, reset, show]);

  const currentExpertise = watch("expertise") || [];

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!currentExpertise.includes(tagInput.trim())) {
        setValue("expertise", [...currentExpertise, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setValue(
      "expertise",
      currentExpertise.filter((t) => t !== tag),
    );
  };

  const onSubmit = (data: EditMemberForm) => {
    onSave(data);
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
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-surface-0 border border-border rounded-none p-10 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-none text-primary border border-primary/20">
                  <Cpu size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                    Modify member Profile
                  </h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                    System permissions and specialization mapping
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
              {/* Member Summary */}
              <div className="p-4 bg-surface-1 border border-border flex items-center gap-4">
                <div
                  className={`h-10 w-10 border border-border flex items-center justify-center text-xs font-bold ${member?.avatarColor}`}
                >
                  {member?.name?.[0] || "U"}
                </div>
                <div>
                  <p className="text-xs font-bold text-heading uppercase tracking-widest">
                    {member?.name}
                  </p>
                  <p className="text-[10px] text-muted font-mono">
                    {member?.email}
                  </p>
                </div>
              </div>

              {/* Role & Tier */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                    <Shield size={10} /> Access Role
                  </label>
                  <select
                    {...register("role")}
                    className="w-full bg-surface-1 border border-border rounded-none px-4 py-3 text-sm text-heading focus:outline-none focus:border-primary/50 transition-all appearance-none"
                  >
                    <option value="viewer">Tactical Viewer</option>
                    <option value="developer">Active Developer</option>
                    <option value="tester">Field Tester</option>
                    <option value="admin">System Admin</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                    <Layers size={10} /> Response Tier
                  </label>
                  <select
                    {...register("tier", { valueAsNumber: true })}
                    className="w-full bg-surface-1 border border-border rounded-none px-4 py-3 text-sm text-heading focus:outline-none focus:border-primary/50 transition-all appearance-none"
                  >
                    {TIER_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Expertise Tags */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <Cpu size={10} /> Specialized Expertise
                </label>
                <div className="p-3 bg-surface-1 border border-border focus-within:border-primary/50 transition-all">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {currentExpertise.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1.5 px-2 py-1 bg-surface-2 border border-border text-[9px] font-bold uppercase tracking-widest text-heading group"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-muted hover:text-danger"
                        >
                          <XCircle size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    placeholder="Type expertise (e.g. Kubernetes) and press Enter"
                    className="w-full bg-transparent text-[11px] text-heading focus:outline-none placeholder:text-muted/30"
                  />
                </div>
              </div>

              {/* Theme Palette */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <Palette size={10} /> Profile Theme
                </label>
                <div className="flex gap-4 p-4 bg-surface-1 border border-border">
                  {THEME_OPTIONS.map((theme) => (
                    <button
                      key={theme.value}
                      type="button"
                      onClick={() => setValue("avatarColor", theme.value)}
                      className={`h-8 w-8 transition-all hover:scale-110 active:scale-95 ${theme.value.split(" ")[0]} border ${
                        watch("avatarColor") === theme.value
                          ? "border-white border-2"
                          : "border-transparent"
                      }`}
                      title={theme.label}
                    />
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-primary text-black py-4 rounded-none text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-3"
                >
                  <Save size={14} />
                  Synchronize member Profile
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
