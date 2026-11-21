import { z } from "zod";

const optionalText = z.string().trim().max(500).optional().or(z.literal(""));
const optionalDate = z.string().date().optional().or(z.literal(""));

export const clientRecordSchema = z.object({
  name: z.string().trim().min(2, "Client name must be at least 2 characters.").max(120),
  company: optionalText,
  email: z.string().email("Enter a valid email address.").optional().or(z.literal("")),
  status: z.enum(["lead", "active", "inactive"]),
});

export const projectRecordSchema = z.object({
  name: z.string().trim().min(2, "Project name must be at least 2 characters.").max(140),
  description: optionalText,
  status: z.enum(["planning", "active", "on_hold", "completed"]),
  priority: z.enum(["low", "medium", "high"]),
  due_date: optionalDate,
  client_id: z.string().uuid().optional().or(z.literal("")),
});

export const taskRecordSchema = z.object({
  title: z.string().trim().min(2, "Task title must be at least 2 characters.").max(180),
  description: optionalText,
  status: z.enum(["todo", "in_progress", "review", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  due_date: optionalDate,
  project_id: z.string().uuid("Select a project before saving the task."),
});
