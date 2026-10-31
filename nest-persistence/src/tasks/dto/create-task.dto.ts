import z from 'zod';

export const createTaskDto = z.strictObject({
  title: z.string().trim().min(3).max(150),
});

export type CreateTaskDto = z.infer<typeof createTaskDto>;
