import { initDatabaseConnection } from 'src/shared/database/database-connection';

import {
  ProductRepository,
  createProductTable,
} from './entities/product.repository';
import { ProductService } from './product.service';

export class ProductModule {
  private static module: ProductModule;

  private constructor(readonly productService: ProductService) {}

  static async init(): Promise<ProductModule> {
    if (!this.module) {
      await initDatabaseConnection();

      await createProductTable();

      const productService: ProductService = new ProductService(
        new ProductRepository(),
      );

      this.module = new ProductModule(productService);
    }

    return this.module;
  }
}
