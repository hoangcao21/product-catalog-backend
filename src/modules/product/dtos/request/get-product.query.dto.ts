import { QueryDto, createQuerySchema } from 'src/shared/dto/request';
import z from 'zod';

export const getProductsQuerySchema = createQuerySchema({
  name: z.string().max(255).optional(),
  category: z.string().min(1).max(255),
});

export type IGetProductsQuerySchema = z.infer<typeof getProductsQuerySchema>;

export class GetProductQueryDto extends QueryDto {
  constructor(props: IGetProductsQuerySchema) {
    super(props.limit, props.cursor);

    Object.assign(this, props);
  }

  name?: string;
  category?: string;
}
