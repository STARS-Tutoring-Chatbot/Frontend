import { z } from "zod";

// Use for creating new conversation in dashboard.tsx

export const newConversation = z
  .object({
    title: z.string().min(10).max(100),
    description: z.string().min(10).max(500),
    model: z.string(),
  })
  .refine((data) => data.model !== "", {
    message: "Please select a model",
    path: ["model"],
  });

export const login = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const register = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const conversationMessageInput = z.object({}); // TODO: work on this

export type NewConversation = z.infer<typeof newConversation>;
export type Login = z.infer<typeof login>;
export type Register = z.infer<typeof register>;
