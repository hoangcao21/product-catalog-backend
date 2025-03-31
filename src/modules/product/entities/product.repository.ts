import * as dynamoose from 'dynamoose';
import { Condition } from 'dynamoose/dist/Condition';
import { QueryResponse } from 'dynamoose/dist/ItemRetriever';
import { CursorUtils } from 'src/shared/cursor';
import { PaginatedQueryDbResponse } from 'src/shared/paginated-query-response';

import { ProductEntity } from './product.entity';

const ProductModel = dynamoose.model<ProductEntity>('Product', {
  productId: {
    type: String,
    hashKey: true,
    default: () => crypto.randomUUID(),
  },
  name: {
    type: String,
    required: true,
  },
  nameLowercase: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  categoryLowercase: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

export class ProductRepository {
  private readonly model: typeof ProductModel = ProductModel;

  async getManyByProps(props: {
    name?: string;
    category?: string;
    pageSize?: number;
    cursor?: string; // String in Base64 format
  }): Promise<PaginatedQueryDbResponse<ProductEntity>> {
    const { name, category, pageSize, cursor } = props;

    let condition: Condition = new Condition();

    if (name) {
      condition = condition.where('nameLowercase').contains(name.toLowerCase());
    }

    if (category) {
      condition = condition
        .where('categoryLowercase')
        .contains(category.toLowerCase());
    }

    const results: QueryResponse<ProductEntity> = await this.model
      .query(condition)
      .limit(pageSize)
      .startAt(CursorUtils.toObject(cursor))
      .exec();

    return new PaginatedQueryDbResponse(
      results,
      results.count,
      results.lastKey,
    );
  }
}
