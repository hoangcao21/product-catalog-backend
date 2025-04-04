import { ProductReviewEntity } from '../../entities/product-review.entity';

export class ProductReviewDto {
  reviewId: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;

  static from(entity: ProductReviewEntity) {
    const productReviewDto: ProductReviewDto = new ProductReviewDto();

    productReviewDto.reviewId = entity.reviewId;
    productReviewDto.productId = entity.productId;
    productReviewDto.userId = entity.userId;
    productReviewDto.rating = entity.rating;
    productReviewDto.comment = entity.comment;

    return productReviewDto;
  }
}
