import { PaginationQueryResponse } from 'src/shared/database/pagination-query-response';

import { GetProductQueryDto } from './dtos/request/get-product.query.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductRepository } from './entities/product.repository';

export class ProductService {
  constructor(private readonly productRepo: ProductRepository) {}

  async getProducts(
    dto: GetProductQueryDto,
  ): Promise<PaginationQueryResponse<ProductEntity>> {
    return this.productRepo.findByProps(dto);
  }

  async getProduct(productId: string): Promise<ProductEntity> {
    return this.productRepo.findOne(productId);
  }
}
