"use client";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { serviceSchema } from "../schema/serviceSchema";
import { MetadataForm } from "./MetadataForm";
import { AssignmentRulesForm } from "./AssignmentRulesForm";
import {
  Activity,
  Globe,
  Zap,
  Link as LinkIcon,
  FileText,
  ChevronDown,
} from "lucide-react";

interface ServiceFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
}) => {
  const defaultValues = {
    name: initialData?.name || "",
    description: initialData?.description || "",
    baseUrl: initialData?.baseUrl || "",
    environment: initialData?.environment || "development",
    autoAssignEnabled: initialData?.autoAssignEnabled ?? true,
    assignmentRules: initialData?.assignmentRules || [],
    metadataList: initialData?.metadata
      ? Object.entries(initialData.metadata).map(([key, value]) => ({
          key,
          value,
        }))
      : [],
  };

  const methods = useForm<any>({
    resolver: zodResolver(
      serviceSchema.extend({
        metadataList: z
          .array(
            z.object({
              key: z.string(),
              value: z.any(),
            }),
          )
          .optional(),
      }) as any,
    ),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const [isEnvOpen, setIsEnvOpen] = React.useState(false);
  const envMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        envMenuRef.current &&
        !envMenuRef.current.contains(event.target as Node)
      ) {
        setIsEnvOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFormSubmit = (values: any) => {
    const metadata: Record<string, any> = {};
    values.metadataList?.forEach((item: any) => {
      if (item.key) metadata[item.key] = item.value;
    });

    const finalData = {
      ...values,
      metadata,
      assignmentRules: values.assignmentRules.map((rule: any) => ({
        ...rule,
        teams:
          typeof rule.teams === "string"
            ? rule.teams
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean)
            : rule.teams,
      })),
    };

    delete (finalData as any).metadataList;
    onSubmit(finalData);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-8 animate-in fade-in duration-500"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
              Service Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center text-muted">
                <Activity size={14} />
              </div>
              <input
                {...register("name")}
                placeholder="e.g. Authentication Service"
                className="w-full bg-surface-2 border border-border rounded-none pl-12 pr-5 py-3 text-sm text-heading focus:outline-none focus:border-primary transition-all placeholder:text-muted/50"
              />
            </div>
            {errors.name && (
              <p className="text-[10px] text-danger font-medium ml-1">
                {errors.name.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
              Environment
            </label>
            <div className="relative group" ref={envMenuRef}>
              <button
                type="button"
                onClick={() => setIsEnvOpen(!isEnvOpen)}
                className="w-full flex items-center justify-between bg-surface-2 border border-border rounded-none px-4 py-3 text-sm text-heading focus:outline-none focus:border-primary transition-all hover:bg-surface-1"
              >
                <div className="flex items-center gap-3">
                  <Globe
                    size={14}
                    className={isEnvOpen ? "text-primary" : "text-muted"}
                  />
                  <span className="capitalize">{watch("environment")}</span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-muted transition-transform duration-300 ${isEnvOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isEnvOpen && (
                <div className="absolute left-0 top-full z-[100] mt-1 w-full rounded-none border border-border bg-surface-2 p-1 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                  {["development", "staging", "production"].map((env) => (
                    <button
                      key={env}
                      type="button"
                      onClick={() => {
                        setValue("environment", env);
                        setIsEnvOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-none px-4 py-2.5 text-left text-xs transition-all ${
                        watch("environment") === env
                          ? "bg-primary text-black font-bold"
                          : "text-zinc-400 hover:bg-surface-3 hover:text-white"
                      }`}
                    >
                      <span className="uppercase tracking-widest">{env}</span>
                      {watch("environment") === env && (
                        <div className="h-1.5 w-1.5 rounded-full bg-black" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input type="hidden" {...register("environment")} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
              Base URL (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center text-muted">
                <LinkIcon size={14} />
              </div>
              <input
                {...register("baseUrl")}
                placeholder="https://api.example.com"
                className="w-full bg-surface-2 border border-border rounded-none pl-12 pr-5 py-3 text-sm text-heading focus:outline-none focus:border-primary transition-all placeholder:text-muted/50"
              />
            </div>
            {errors.baseUrl && (
              <p className="text-[10px] text-danger font-medium ml-1">
                {errors.baseUrl.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
              Description
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center text-muted">
                <FileText size={14} />
              </div>
              <input
                {...register("description")}
                placeholder="Briefly describe this service"
                className="w-full bg-surface-2 border border-border rounded-none pl-12 pr-5 py-3 text-sm text-heading focus:outline-none focus:border-primary transition-all placeholder:text-muted/50"
              />
            </div>
          </div>
        </div>

        <div className="p-5 border border-primary/20 bg-primary/5 rounded-none flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-none text-primary border border-primary/20">
              <Zap size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-tight">
                Auto-Assignment
              </h4>
              <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                Automate incident routing
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register("autoAssignEnabled")}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-surface-2 peer-focus:outline-none rounded-none border border-border peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-600 after:border-zinc-500 after:border after:rounded-none after:h-4 after:w-4 after:transition-all peer-checked:bg-primary peer-checked:after:bg-white"></div>
          </label>
        </div>

        <div className="border-t border-border pt-8">
          <AssignmentRulesForm />
        </div>

        <div className="border-t border-border pt-8">
          <MetadataForm />
        </div>

        <div className="pt-6 flex justify-end gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 bg-primary text-on-primary py-3 rounded-none text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-primary-hover transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Processing..."
              : initialData
                ? "Confirm Update"
                : "Deploy Service"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
