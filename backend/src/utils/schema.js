import z from "zod";

export const exampleSchema = z.object({
  name: z.string().min(3, { message: "Minimum 3 characters." }),
});

export const signUpSchema = z.object({
  name: z.string().min(5, { message: "Minimum 5 characters." }),
  email: z.string().email({ message: "Invalid email." }),
  password: z.string().min(8, { message: "Minimum 8 characters." }),
});

export const signInSchema = signUpSchema.omit({ name: true });

export const mutateCourseSchema = z.object({
  name: z.string().min(5, { message: "Minimum 5 characters." }),
  categoryId: z.string({ message: "Category is required." }),
  tagline: z.string().min(5, { message: "Minimum 5 characters." }),
  description: z.string().min(10, { message: "Minimum 10 characters." }),
});

export const mutateContentSchema = z.object({
  title: z.string().min(5, { message: "Minimum 5 characters." }),
  type: z.string({ message: "Content type is required." }),
  youtubeId: z.string().optional(),
  text: z.string().optional(),
  courseId: z.string().min(5, { message: "Invalid course." }),
});
