import { z } from "zod";

export const assignmentRuleSchema = z.object({
  tagsRegex: z.string().min(1, "Regex is required"),
  teams: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .default([]),
  members: z.array(z.string()).default([]),
});

export const serviceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  baseUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  description: z.string().max(200).optional(),
  environment: z
    .enum(["development", "staging", "production"])
    .default("development"),
  autoAssignEnabled: z.boolean().default(true),
  assignmentRules: z.array(assignmentRuleSchema).default([]),
  members: z.array(z.string()).default([]),
  metadata: z.record(z.string(), z.any()).default({}),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

export const updateServiceSchema = serviceSchema.extend({
  status: z.enum(["active", "inactive", "error"]).optional(),
});

export type UpdateServiceFormData = z.infer<typeof updateServiceSchema>;
