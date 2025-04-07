import { z } from 'zod';

export enum CursorDirection {
  Next = 'next',
  Previous = 'previous',
}

export class QueryDto {
  constructor(
    readonly limit: number = 10,
    readonly cursor: string,
  ) {}
}

export const querySchema = z.object({
  cursor: z.string().base64().optional(),
  limit: z
    .string()
    .default('10')
    .refine((val) => !isNaN(Number(val)), {
      message: 'limit must be a valid number string',
    })
    .transform((val) => Number(val))
    .refine((val) => Number.isInteger(val), {
      message: 'limit must be an integer',
    })
    .refine((val) => val > 0, {
      message: 'limit must be positive',
    })
    .refine((val) => val <= 100, {
      message: 'limit must not exceed 100',
    })
    .optional(),
});

export type IQuerySchema = z.infer<typeof querySchema>;

export function createQuerySchema<T extends z.ZodRawShape>(
  additionalFields: T,
) {
  return querySchema.extend(additionalFields).strict().optional().nullable();
}
