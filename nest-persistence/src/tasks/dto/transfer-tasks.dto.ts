import z from 'zod';

export const transferTasksSchema = z
  .strictObject({
    fromUserId: z.number().int().positive(),
    toUserId: z.number().int().positive(),
  })
  .refine((data) => data.fromUserId !== data.toUserId, {
    error: 'Los usuarios deben ser diferentes.',
  });

export type TransferTasksDto = z.infer<typeof transferTasksSchema>;
