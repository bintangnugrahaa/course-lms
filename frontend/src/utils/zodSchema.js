import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(5, { message: "Name must be at least 5 characters" }),

  email: z.string().email({ message: "Please enter a valid email address" }),

  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters" }),
});
