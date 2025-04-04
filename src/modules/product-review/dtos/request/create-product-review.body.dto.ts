import { z } from 'zod';

export const createProductReviewBodySchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(1).max(255),
});

export type ICreateProductReviewBodySchema = z.infer<
  typeof createProductReviewBodySchema
>;

export class CreateProductReviewBodyDto {
  constructor(props: ICreateProductReviewBodySchema) {
    Object.assign(this, props);
  }

  rating: number;
  comment: string;
}
