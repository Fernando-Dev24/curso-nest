import z from 'zod';

export const registerSchema = z.strictObject({
  name: z.string().min(2).max(80).trim(),
  email: z.email().trim().toLowerCase(),
  password: z.string().min(6).max(128),
});

export type RegisterDto = z.infer<typeof registerSchema>;
