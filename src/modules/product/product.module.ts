import { seedUpProducts } from 'src/seeds/products';
import config from 'src/shared/config';
import { initDatabaseConnection } from 'src/shared/database/database-connection';

import {
  ProductModel,
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

      if (config.NODE_ENV !== 'dev') {
        const count = await ProductModel.scan().all().count().exec();

        if (count.count === 0) {
          console.log('🔃 Seeding up products for non-dev environment');

          await seedUpProducts();
        }
      }

      const productService: ProductService = new ProductService(
        new ProductRepository(),
      );

      this.module = new ProductModule(productService);
    }

    return this.module;
  }
}
