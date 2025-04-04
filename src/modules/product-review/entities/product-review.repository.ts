import * as dynamoose from 'dynamoose';
import { PaginationQueryResponse } from 'src/shared/database/pagination-query-response';
import { Repository } from 'src/shared/database/repository';

import { ProductReviewEntity } from './product-review.entity';

const ProductIdGlobalIndex = {
  type: 'global',
  name: 'productIdGlobalIndex',
  project: true,
  rangeKey: 'createdAt',
};

const ProductReviewSchema = new dynamoose.Schema(
  {
    reviewId: {
      type: String,
      hashKey: true,
      default: () => crypto.randomUUID(),
    },
    productId: {
      type: String,
      required: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      index: ProductIdGlobalIndex as any,
    },
    userId: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }, // "createdAt" & "updatedAt"
);

export const ProductReviewModel = dynamoose.model<ProductReviewEntity>(
  'ProductReview',
  ProductReviewSchema,
);

export async function createProductReviewTable() {
  console.log('🔃 Creating/Updating ProductReviewTable');

  // Create if not existing, else update
  await new dynamoose.Table('ProductReviewTable', [ProductReviewModel], {
    initialize: false,
  }).initialize();

  console.log('✅ ProductReviewTable is existing');
}

export class ProductReviewRepository extends Repository<ProductReviewEntity> {
  constructor() {
    super(ProductReviewModel);
  }

  async findMostRecent(
    productId: string,
    limit = 5,
  ): Promise<PaginationQueryResponse<ProductReviewEntity>> {
    const operation = this.model
      .query('productId')
      .using(ProductIdGlobalIndex.name)
      .eq(productId)
      .sort('descending');

    const result = await this.paginate(operation, undefined, limit);

    return result;
  }

  async create(
    userId: string,
    productId: string,
    rating: number,
    comment: string,
  ): Promise<ProductReviewEntity> {
    const entity: ProductReviewEntity = (await new this.model({
      userId,
      productId,
      rating,
      comment,
    } as Partial<ProductReviewEntity>).save()) as ProductReviewEntity;

    return entity;
  }
}
