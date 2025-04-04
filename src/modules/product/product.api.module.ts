import { ProductReviewModule } from '../product-review/product-review.module';
import { ProductController } from './product.controller';
import { ProductModule } from './product.module';

export class ProductApiModule {
  private static module: ProductApiModule;

  readonly productController: ProductController;

  private constructor(
    productModule: ProductModule,
    productReviewModule: ProductReviewModule,
  ) {
    this.productController = new ProductController(
      productModule.productService,
      productReviewModule.productReviewService,
    );
  }

  static async init(): Promise<ProductApiModule> {
    if (!this.module) {
      this.module = new ProductApiModule(
        await ProductModule.init(),
        await ProductReviewModule.init(),
      );
    }

    return this.module;
  }
}
