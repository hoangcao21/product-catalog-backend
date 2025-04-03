import { ProductController } from './product.controller';
import { ProductModule } from './product.module';

export class ProductApiModule {
  private static module: ProductApiModule;

  readonly productController: ProductController;

  private constructor(productModule: ProductModule) {
    this.productController = new ProductController(
      productModule.productService,
    );
  }

  static async init(): Promise<ProductApiModule> {
    if (!this.module) {
      this.module = new ProductApiModule(await ProductModule.init());
    }

    return this.module;
  }
}
