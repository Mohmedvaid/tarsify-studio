import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z
  .object({
    displayName: z.string().min(2, 'Display name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// Notebook schemas
export const createNotebookSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title is too long'),
  shortDescription: z
    .string()
    .min(10, 'Short description must be at least 10 characters')
    .max(200, 'Short description is too long'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.enum(['image', 'text', 'video', 'audio', 'other'], {
    message: 'Please select a category',
  }),
  gpuType: z.enum(['T4', 'L4', 'A100', 'H100'], {
    message: 'Please select a GPU type',
  }),
  priceCredits: z
    .number()
    .min(1, 'Price must be at least 1 credit')
    .max(10000, 'Price cannot exceed 10,000 credits'),
});

export const updateNotebookSchema = createNotebookSchema.partial();

// Profile schemas
export const updateProfileSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters').optional(),
  bio: z.string().max(500, 'Bio is too long').optional(),
  avatarUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type CreateNotebookFormData = z.infer<typeof createNotebookSchema>;
export type UpdateNotebookFormData = z.infer<typeof updateNotebookSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
