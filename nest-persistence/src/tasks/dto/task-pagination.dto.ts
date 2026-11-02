import z from 'zod';

export const taskPaginationSchema = z.strictObject({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type TaskPaginationDto = z.infer<typeof taskPaginationSchema>;
