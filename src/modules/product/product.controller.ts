import { PaginationQueryResponse } from 'src/shared/database/pagination-query-response';
import { OkResponse, PaginatedResponseBody } from 'src/shared/dto/response';

import { GetProductQueryDto } from './dtos/request/get-product.query.dto';
import { ProductDto } from './dtos/response/product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductService } from './product.service';

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  async getProducts(
    dto: GetProductQueryDto,
  ): Promise<OkResponse<PaginatedResponseBody<ProductDto>>> {
    const response: PaginationQueryResponse<ProductEntity> =
      await this.productService.getProducts(dto);

    console.log('✅ Got products successfully');

    return OkResponse.fromPagination(response);
  }
}
