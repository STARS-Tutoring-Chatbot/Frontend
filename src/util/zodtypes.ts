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

export const newMessage = z.object({
  messsage: z.string().min(1),
});

export const login = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const register = z
  .object({
    email: z.string().email(),
    confirmEmail: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    confirmed: z.boolean(),
  })
  .refine(
    (data) => {
      // if the email is not a fiu.edu email, return false
      return data.email.endsWith("fiu.edu");
    },
    {
      message: "You must use an @fiu.edu email",
      path: ["email"],
    }
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword", "password"],
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Emails don't match",
    path: ["confirmEmail"],
  })
  .refine((data) => data.confirmed, {
    message: "You must agree to the terms and conditions",
    path: ["confirmed"],
  });

export const conversationMessageInput = z.object({
  message: z.string().min(1),
});

export const conversationSettingsChange = z
  .object({
    title: z.string().min(10).max(100),
    description: z.string().min(10).max(500),
    model: z.string(),
    tone: z.array(z.number()).length(1),
  })
  .refine((data) => data.model !== "", {
    message: "Please select a model",
    path: ["model"],
  });

export const forgotPasswordInitializer = z.object({
  email: z.string().email(),
});

export const forgotPasswordUpdate = z
  .object({
    passwordReset: z.string().min(6),
    confirmPasswordReset: z.string().min(6),
  })
  .refine((data) => data.passwordReset === data.confirmPasswordReset, {
    message: "Passwords don't match",
    path: ["confirmPasswordReset", "passwordReset"],
  });

export type NewConversation = z.infer<typeof newConversation>;
export type Login = z.infer<typeof login>;
export type Register = z.infer<typeof register>;
