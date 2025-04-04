import { Item } from 'dynamoose/dist/Item';

export class ProductReviewEntity extends Item {
  reviewId: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
}
