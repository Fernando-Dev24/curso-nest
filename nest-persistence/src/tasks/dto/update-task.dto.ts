import z from 'zod';

export const updateTaskDto = z
  .strictObject({
    title: z.string().trim().min(3).max(150),
    isCompleted: z.boolean(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    error: 'Debes proporcionar al menos un campo',
  });

export type UpdateTaskDto = z.infer<typeof updateTaskDto>;
