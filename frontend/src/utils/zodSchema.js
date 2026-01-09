import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const signUpSchema = z.object({
  name: z.string().min(5, { message: "Minimum 5 characters." }),

  email: z.string().email({ message: "Invalid email." }),

  password: z.string().min(8, { message: "Minimum 8 characters." }),
});

export const signInSchema = signUpSchema.omit({ name: true });

export const createCourseSchema = z.object({
  name: z.string().min(5, { message: "Minimum 5 characters." }),

  categoryId: z.string().min(5, { message: "Required." }),

  tagline: z.string().min(5, { message: "Minimum 5 characters." }),

  description: z.string().min(10, { message: "Minimum 10 characters." }),

  thumbnail: z
    .instanceof(File, { message: "File required." })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Invalid file type.",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "File size exceeds 2MB.",
    }),
});

export const updateCourseSchema = createCourseSchema.partial({
  thumbnail: true,
});
