import { ProductReviewEntity } from './entities/product-review.entity';
import { ProductReviewRepository } from './entities/product-review.repository';

export class ProductReviewService {
  constructor(private readonly productReviewRepo: ProductReviewRepository) {}

  async getMostRecentProductReviews(
    productId: string,
  ): Promise<ProductReviewEntity[]> {
    const { result } = await this.productReviewRepo.findMostRecent(productId);

    return result;
  }
}
