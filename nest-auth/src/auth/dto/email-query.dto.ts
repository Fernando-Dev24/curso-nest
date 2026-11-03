import z from 'zod';

export const emailQuerySchema = z.strictObject({
  email: z.email(),
});

export type EmailQueryDto = z.infer<typeof emailQuerySchema>;
