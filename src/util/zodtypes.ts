import { z } from "zod";

// Use for creating new conversation in dashboard.tsx

const newConversation = z.object({
  title: z.string(),
  description: z.string().max(200),
  model: z.string(),
});

const login = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const register = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const conversationMessageInput = z.object({}); // TODO: work on this

export type NewConversation = z.infer<typeof newConversation>;
export type Login = z.infer<typeof login>;
export type Register = z.infer<typeof register>;
