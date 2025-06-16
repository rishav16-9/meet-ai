import { z } from "zod";

export const agentsInsertSchema = z.object({
  name: z.string().min(1, "Name is required"),
  instructions: z.string().min(1, "Instructions is required"),
});

export const agentsUpdateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  instructions: z.string().min(1, "Instructions is required"),
});

export const agentDeleteSchema = z.object({
  id: z.string(),
});
