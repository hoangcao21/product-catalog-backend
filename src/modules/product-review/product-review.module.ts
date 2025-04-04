import { initDatabaseConnection } from 'src/shared/database/database-connection';

import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import {
  ProductReviewRepository,
  createProductReviewTable,
} from './entities/product-review.repository';
import { ProductReviewService } from './product-review.service';

export class ProductReviewModule {
  private static module: ProductReviewModule;

  readonly productReviewRepository: ProductReviewRepository;
  readonly productReviewService: ProductReviewService;

  private constructor(userModule: UserModule, productModule: ProductModule) {
    this.productReviewRepository = new ProductReviewRepository();
    this.productReviewService = new ProductReviewService(
      this.productReviewRepository,
      userModule.userService,
      productModule.productService,
    );
  }

  static async init() {
    if (!this.module) {
      await initDatabaseConnection();

      await createProductReviewTable();

      this.module = new ProductReviewModule(
        await UserModule.init(),
        await ProductModule.init(),
      );
    }

    return this.module;
  }
}
