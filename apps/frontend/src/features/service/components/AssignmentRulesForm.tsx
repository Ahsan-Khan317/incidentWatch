"use client";
import React from "react";
import { Plus, Trash2, Shield, Users, User } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useTeam } from "../../team/hooks/useTeam";

export const AssignmentRulesForm: React.FC = () => {
  const { register, control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "assignmentRules",
  });
  const { team: members } = useTeam();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-primary" />
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
            Auto-Assignment Rules
          </label>
        </div>
        <button
          type="button"
          onClick={() => append({ tagsRegex: ".*", teams: [], members: [] })}
          className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-wider hover:text-primary-hover transition-colors"
        >
          <Plus size={14} />
          Add Rule
        </button>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 border border-dashed border-border-soft rounded-none bg-surface-1/30">
          <p className="text-xs text-zinc-600 font-medium italic">
            No custom assignment rules defined. Default routing will be used.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="p-5 border border-border-soft rounded-none bg-surface-1/50 relative animate-in fade-in zoom-in-95 duration-200"
          >
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-4 right-4 p-2 rounded-none hover:bg-danger/10 text-zinc-600 hover:text-danger transition-colors"
            >
              <Trash2 size={16} />
            </button>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                  Tags Regex
                </label>
                <input
                  {...register(`assignmentRules.${index}.tagsRegex` as const)}
                  placeholder="e.g. ^auth.* or backend"
                  className="w-full bg-surface-2 border border-border-soft rounded-none px-4 py-2.5 text-xs text-heading focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted/50 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                    <Users size={10} /> Assign to Teams (IDs)
                  </label>
                  <input
                    {...register(`assignmentRules.${index}.teams` as const)}
                    placeholder="Team IDs (comma separated)"
                    className="w-full bg-surface-2 border border-border-soft rounded-none px-4 py-2.5 text-xs text-heading focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                    <User size={10} /> Assign to Members
                  </label>
                  <select
                    multiple
                    {...register(`assignmentRules.${index}.members` as const)}
                    className="w-full bg-surface-2 border border-border-soft rounded-none px-4 py-2.5 text-xs text-heading focus:outline-none focus:border-primary/50 transition-all appearance-none h-24"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primary/5 border border-primary/10 rounded-none p-4 flex gap-3">
        <div className="p-2 bg-primary/10 rounded text-primary h-fit">
          <Shield size={14} />
        </div>
        <p className="text-[10px] text-zinc-400 leading-relaxed">
          Rules are evaluated in order. The first rule that matches an
          incident's tags will determine the assigned responders. Use{" "}
          <code className="text-primary">.*</code> to match all tags.
        </p>
      </div>
    </div>
  );
};
