"use client";
import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

export const MetadataForm: React.FC = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "metadataList",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
          Service Metadata
        </label>
        <button
          type="button"
          onClick={() => append({ key: "", value: "" })}
          className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-wider hover:text-primary-hover transition-colors"
        >
          <Plus size={14} />
          Add Property
        </button>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-6 border border-dashed border-border-soft rounded-none bg-surface-1/30">
          <p className="text-xs text-zinc-600 font-medium italic">
            No metadata defined
          </p>
        </div>
      )}

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex gap-3 items-start animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <div className="flex-1 space-y-1">
              <input
                {...register(`metadataList.${index}.key` as const)}
                placeholder="Key (e.g. region)"
                className="w-full bg-surface-2 border border-border rounded-none px-4 py-2.5 text-xs text-heading focus:outline-none focus:border-primary transition-all placeholder:text-muted/50"
              />
            </div>
            <div className="flex-1 space-y-1">
              <input
                {...register(`metadataList.${index}.value` as const)}
                placeholder="Value (e.g. us-east-1)"
                className="w-full bg-surface-2 border border-border rounded-none px-4 py-2.5 text-xs text-heading focus:outline-none focus:border-primary transition-all placeholder:text-muted/50"
              />
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              className="p-2.5 rounded-none hover:bg-danger/10 text-zinc-600 hover:text-danger transition-colors mt-0.5"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      <p className="text-[9px] text-zinc-600 font-medium px-1">
        Metadata can be used for custom filtering and external integrations.
      </p>
    </div>
  );
};
