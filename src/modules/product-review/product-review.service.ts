import { BadRequestError } from 'src/shared/errors/http';

import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';
import { ProductReviewEntity } from './entities/product-review.entity';
import { ProductReviewRepository } from './entities/product-review.repository';

export class ProductReviewService {
  constructor(
    private readonly productReviewRepo: ProductReviewRepository,
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}

  async getMostRecentProductReviews(
    productId: string,
  ): Promise<ProductReviewEntity[]> {
    const { result } = await this.productReviewRepo.findMostRecent(productId);

    return result;
  }

  async createProductReview(
    userId: string,
    productId: string,
    rating: number,
    comment: string,
  ): Promise<ProductReviewEntity> {
    if (!(await this.userService.getUserById(userId))) {
      console.log('❌ User is not found', { userId });

      throw new BadRequestError(
        'FAILED_TO_CREATE_REVIEW_ERROR',
        'Failed to create review',
        { userId },
      );
    }

    if (!(await this.productService.getProduct(productId))) {
      console.log('❌ Product is not found', { productId });

      throw new BadRequestError(
        'FAILED_TO_CREATE_REVIEW_ERROR',
        'Failed to create review',
        { productId },
      );
    }

    return await this.productReviewRepo.create(
      userId,
      productId,
      rating,
      comment,
    );
  }
}
