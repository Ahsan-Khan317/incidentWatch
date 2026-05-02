import { z } from "zod";

export const teamMemberSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(1, "Role is required"),
  email: z.string().email("Invalid email address"),
  expertise: z.array(z.string()).default([]),
  status: z.enum(["on-duty", "off-duty", "away"]).default("off-duty"),
  avatarColor: z.string().optional(),
  tier: z.number().optional().default(1),
});

export type TeamMemberSchema = z.infer<typeof teamMemberSchema>;

export const teamInviteSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
});

export type TeamInviteSchema = z.infer<typeof teamInviteSchema>;

export const teamSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Team name must be at least 2 characters"),
  description: z.string().max(200).optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid color hex")
    .default("#3b82f6"),
  members: z.array(z.string()).default([]),
});

export type TeamSchema = z.infer<typeof teamSchema>;
