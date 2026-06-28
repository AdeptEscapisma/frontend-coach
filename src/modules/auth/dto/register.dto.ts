import { z } from 'zod';

export const registerSchema = z.object({
  login: z.string().min(1, 'Login is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
  birthday: z.iso.date(),
  gender: z.enum(['M', 'F']),
});

export type RegisterDto = z.infer<typeof registerSchema>;
