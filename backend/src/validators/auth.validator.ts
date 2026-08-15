import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  name: z.string().min(2, "Name must be at least 2 characters long"),
  handle: z.string().min(2).optional(),
  avatar: z.string().url("Avatar must be a valid URL").optional(),
  college: z.string().min(2).optional().default("University Campus"),
  major: z.string().min(2).optional().default("General Studies"),
  year: z.string().optional().default("Undergraduate"),
  bio: z.string().optional().default("Passionate learner and skill exchanger."),
  skillsTeaching: z.array(z.string()).optional().default([]),
  skillsLearning: z.array(z.string()).optional().default([]),
  availability: z.string().optional().default("Flexible on weekdays"),
  socialLinks: z
    .object({
      github: z.string().optional(),
      linkedin: z.string().optional(),
      discord: z.string().optional(),
      portfolio: z.string().optional(),
    })
    .optional()
    .default({}),
});

export type RegisterInput = z.infer<typeof registerSchema>;
