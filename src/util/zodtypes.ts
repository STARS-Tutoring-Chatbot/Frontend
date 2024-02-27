import { z } from "zod";

// Use for creating new conversation in dashboard.tsx

export const newConversation = z.object({
  title: z.string().min(10).max(100),
  description: z.string().min(10).max(500),
  model: z.string(),
});

export const login = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const register = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const conversationMessageInput = z.object({}); // TODO: work on this

export type NewConversation = z.infer<typeof newConversation>;
export type Login = z.infer<typeof login>;
export type Register = z.infer<typeof register>;
