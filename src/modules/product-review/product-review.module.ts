import { initDatabaseConnection } from 'src/shared/database/database-connection';

import {
  ProductReviewRepository,
  createProductReviewTable,
} from './entities/product-review.repository';
import { ProductReviewService } from './product-review.service';

export class ProductReviewModule {
  private static module: ProductReviewModule;

  readonly productReviewRepository: ProductReviewRepository;
  readonly productReviewService: ProductReviewService;

  private constructor() {
    this.productReviewRepository = new ProductReviewRepository();
    this.productReviewService = new ProductReviewService(
      this.productReviewRepository,
    );
  }

  static async init() {
    if (!this.module) {
      await initDatabaseConnection();

      await createProductReviewTable();

      this.module = new ProductReviewModule();
    }

    return this.module;
  }
}
