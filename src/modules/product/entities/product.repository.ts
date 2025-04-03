import * as dynamoose from 'dynamoose';
import { Query, Scan } from 'dynamoose/dist/ItemRetriever';
import { PaginationQueryResponse } from 'src/shared/database/pagination-query-response';
import { Repository } from 'src/shared/database/repository';
import { isDefined } from 'src/shared/validation';

import { GetProductQueryDto } from '../dtos/request/get-product.query.dto';
import { ProductEntity } from './product.entity';

const CategoryGlobalIndex = {
  type: 'global',
  name: 'categoryGlobalIndex',
  project: true,
  rangeKey: 'productId',
};

const ProductModelSchema = new dynamoose.Schema({
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    index: CategoryGlobalIndex as any,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

export const ProductModel = dynamoose.model<ProductEntity>(
  'Product',
  ProductModelSchema,
);

export async function createProductTable() {
  console.log('🔃 Creating/Updating ProductTable');

  // Create if not existing, else update
  await new dynamoose.Table('ProductTable', [ProductModel], {
    initialize: false,
  }).initialize();

  console.log('✅ ProductTable is existing');
}

export class ProductRepository extends Repository<ProductEntity> {
  constructor() {
    super(ProductModel);
  }

  async findByProps(
    props: GetProductQueryDto,
  ): Promise<PaginationQueryResponse<ProductEntity>> {
    const { category, name, limit, cursor } = props;

    let operation: Query<ProductEntity> | Scan<ProductEntity> = this.model
      .query('categoryLowercase')
      .eq(category)
      .using(CategoryGlobalIndex.name);

    if (isDefined(name)) {
      operation = this.model
        .scan('categoryLowercase')
        .eq(category.toLowerCase())
        .where('nameLowercase')
        .contains(name.toLowerCase()) // "contains" does not support non-key attribute when uses with ".query()" function yet
        .using(CategoryGlobalIndex.name);
    }

    const result = await this.paginate(operation, cursor, limit);

    return result;
  }
}
