import z from 'zod';

export const createUserSchema = z
  .object({
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  })
  .strict();

export type CreateUserDto = z.infer<typeof createUserSchema>;
