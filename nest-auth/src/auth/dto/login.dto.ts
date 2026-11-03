import z from 'zod';

export const loginSchema = z.strictObject({
  email: z.email('El correo es invalido').trim().toLowerCase(),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type LoginDto = z.infer<typeof loginSchema>;
