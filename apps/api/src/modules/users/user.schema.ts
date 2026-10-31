import { z } from 'zod';

const passwordValidation = z
  .string()
  .min(9, 'Password must be longer than 8 characters')
  .refine((val) => /[A-Z]/.test(val), {
    message: 'Password must contain at least one uppercase letter',
  })
  .refine((val) => /[a-z]/.test(val), {
    message: 'Password must contain at least one lowercase letter',
  })
  .refine((val) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(val), {
    message: 'Password must contain at least one special character',
  });

export const createStaffSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordValidation,
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['STAFF', 'BUSINESS_ADMIN'], {
    errorMap: () => ({ message: "Role must be 'STAFF' or 'BUSINESS_ADMIN'" }),
  }),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  role: z.enum(['STAFF', 'BUSINESS_ADMIN']).optional(),
  isActive: z.boolean().optional(),
});

export type CreateStaffInput = z.infer<typeof createStaffSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
