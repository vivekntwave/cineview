import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "validation.usernameMin"),
  password: z.string().min(6, "validation.passwordMin"),
});

export type LoginForm = z.infer<typeof loginSchema>;
