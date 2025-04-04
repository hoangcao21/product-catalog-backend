import z from 'zod';

export const productIdPathParamSchema = z.object({
  productId: z.string().uuid(),
});

export type IProductIdPathParamSchema = z.infer<
  typeof productIdPathParamSchema
>;
