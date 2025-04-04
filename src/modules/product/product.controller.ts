import { PaginationQueryResponse } from 'src/shared/database/pagination-query-response';
import {
  OkResponse,
  PaginatedResponseBody,
  StandardResponseBody,
} from 'src/shared/dto/response';
import { BadRequestError } from 'src/shared/errors/http';

import { ProductReviewEntity } from '../product-review/entities/product-review.entity';
import { ProductReviewService } from '../product-review/product-review.service';
import { GetProductQueryDto } from './dtos/request/get-product.query.dto';
import { ProductDto } from './dtos/response/product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductService } from './product.service';

export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productReviewService: ProductReviewService,
  ) {}

  async getProducts(
    dto: GetProductQueryDto,
  ): Promise<OkResponse<PaginatedResponseBody<ProductDto>>> {
    const response: PaginationQueryResponse<ProductEntity> =
      await this.productService.getProducts(dto);

    console.log('✅ Got products successfully');

    return OkResponse.fromPagination(
      response.toPaginatedResponseBody<ProductDto>(ProductDto),
    );
  }

  async getProductDetail(
    productId: string,
  ): Promise<OkResponse<StandardResponseBody<ProductDto>>> {
    const productEntity: ProductEntity =
      await this.productService.getProduct(productId);

    if (!productEntity) {
      throw new BadRequestError(
        'PRODUCT_NOT_FOUND_ERROR',
        'Product is not found',
        { productId },
      );
    }

    const productReviewEntities: ProductReviewEntity[] =
      await this.productReviewService.getMostRecentProductReviews(productId);

    return OkResponse.fromResult(
      ProductDto.from(productEntity, productReviewEntities),
    );
  }

  async createProductReview(
    userId: string,
    productId: string,
    rating: number,
    comment: string,
  ): Promise<OkResponse<StandardResponseBody<ProductDto>>> {
    await this.productReviewService.createProductReview(
      userId,
      productId,
      rating,
      comment,
    );

    return this.getProductDetail(productId);
  }
}
