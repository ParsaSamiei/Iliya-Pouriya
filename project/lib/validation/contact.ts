import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  message: z.string().min(1).max(5000),
  recipient: z.string().nullable().optional(),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
