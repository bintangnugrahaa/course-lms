import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(5, "Name too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(5, "Password too short"),
});

export const signInSchema = signUpSchema.omit({ name: true });
