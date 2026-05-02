"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Info, Plus, UserCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { teamSchema } from "../schema/team.schema";
import { TeamMember } from "../../dashboard/types";

interface CreateTeamModalProps {
  show: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
  isLoading?: boolean;
  availableMembers: TeamMember[];
  initialData?: any;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  show,
  onClose,
  onAdd,
  isLoading,
  availableMembers,
  initialData,
}) => {
  const isEditing = !!initialData;
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "#3b82f6",
      members: [] as string[],
    },
  });

  React.useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description || "",
        color: initialData.color || "#3b82f6",
        members: initialData.members?.map((m: any) => m._id || m) || [],
      });
    } else {
      reset({
        name: "",
        description: "",
        color: "#3b82f6",
        members: [],
      });
    }
  }, [initialData, reset, show]);

  const selectedMembers = watch("members") || [];

  const toggleMember = (userId: string) => {
    const current = [...selectedMembers];
    const index = current.indexOf(userId);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(userId);
    }
    setValue("members", current);
  };

  const onSubmit = (data: any) => {
    onAdd(data);
    reset();
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
            className="relative w-full max-w-2xl bg-surface-0 border border-border rounded-none p-10 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-none text-primary border border-primary/20">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                    Create Operation Team
                  </h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                    Team Formation & Assignment
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
                    Team Name
                  </label>
                  <input
                    {...register("name")}
                    placeholder="e.g. Backend Guardians"
                    className={`w-full bg-surface-1 border ${errors.name ? "border-danger/50" : "border-border"} rounded-none px-4 py-3 text-sm text-heading focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted/30`}
                  />
                  {errors.name && (
                    <p className="text-[10px] text-danger mt-1 font-bold uppercase tracking-tight">
                      {errors.name.message as string}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">
                    Team Color
                  </label>
                  <div className="flex gap-2 p-1 bg-surface-1 border border-border h-[46px] items-center px-3">
                    <input
                      {...register("color")}
                      type="color"
                      className="w-8 h-8 bg-transparent border-none cursor-pointer"
                    />
                    <span className="text-[10px] font-mono text-muted/60 uppercase">
                      {watch("color")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  placeholder="Primary objective and responsibilities..."
                  rows={2}
                  className="w-full bg-surface-1 border border-border rounded-none px-4 py-3 text-sm text-heading focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted/30 resize-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                    Assign Engineers ({selectedMembers.length})
                  </label>
                  <span className="text-[9px] font-bold text-primary/50 uppercase">
                    Ready for Deployment
                  </span>
                </div>
                <div className="max-h-48 overflow-y-auto pr-2 custom-scrollbar border border-border bg-surface-1/50">
                  <div className="grid grid-cols-2 gap-px bg-border">
                    {availableMembers.map((member: any) => (
                      <button
                        key={member.userId}
                        type="button"
                        onClick={() => toggleMember(member.userId)}
                        className={`flex items-center gap-3 p-3 text-left transition-all bg-surface-1 hover:bg-surface-2 ${
                          selectedMembers.includes(member.userId)
                            ? "ring-1 ring-inset ring-primary bg-primary/5"
                            : ""
                        }`}
                      >
                        <div
                          className={`h-8 w-8 flex items-center justify-center text-[10px] font-bold border border-border ${member.avatarColor}`}
                        >
                          {member.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold text-heading uppercase truncate">
                            {member.name}
                          </p>
                          <p className="text-[9px] text-muted truncate">
                            {member.role}
                          </p>
                        </div>
                        {selectedMembers.includes(member.userId) && (
                          <UserCheck size={14} className="text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                {availableMembers.length === 0 && (
                  <div className="py-8 text-center border border-dashed border-border">
                    <p className="text-[10px] text-muted uppercase italic tracking-widest">
                      No engineers available to assign
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isLoading || !watch("name")}
                  className="w-full bg-primary text-black py-4 rounded-none text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-primary/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? "Synchronizing Team..."
                    : "Deploy Operation Team"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
