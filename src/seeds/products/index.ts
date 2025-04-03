import Chance from 'chance';
import {
  ProductCategory,
  ProductEntity,
} from 'src/modules/product/entities/product.entity';
import { ProductModel } from 'src/modules/product/entities/product.repository';
import { ProductEntityBuilder } from 'src/shared/builders/product-entity.builder';

export async function seedUpProducts() {
  const chance = new Chance();

  console.log('🔃 Preparing seeding data for ProductTable...');

  const seedData: ProductEntity[] = new Array(60).fill(1).map(() =>
    new ProductEntityBuilder()
      .buildProductId(chance.guid({ version: 4 }))
      .buildPrice(chance.floating({ min: 0, max: 20 }))
      .buildName(chance.name())
      .buildImageUrl('https://picsum.photos/200/300')
      .buildDescription(chance.paragraph())
      .buildCategory(
        chance.weighted(
          [
            ProductCategory.Food,
            ProductCategory.Lifestyle,
            ProductCategory.Tech,
          ],
          [1, 1, 1],
        ),
      )
      .getResult(),
  );

  console.log('✅ Seeding data for ProductTable is ready');

  console.log('🔃 Seeding data into ProductTable...');

  await Promise.all(seedData.map((data) => data.save()));

  const result = await ProductModel.scan().count().exec();

  console.log('✅ Data is seeded into ProductTable', { result });
}

export async function seedDownProducts() {
  const result = await ProductModel.scan().attribute('productId').all().exec();

  console.log('🔃 Deleting data from ProductTable...', { result });

  try {
    if (result.count) {
      await ProductModel.batchDelete(result.map((val) => val.productId));

      console.log('✅ Deleted data from ProductTable');
    }
  } catch (err) {
    console.log(
      '🔃 Failed to batch delete. Deleting each item from ProductTable...',
      { result, err },
    );

    await Promise.all(result.map((val) => val.delete()));

    console.log('✅ Deleted data from ProductTable');
  }

  console.log('ℹ️ Finish seed down');
}
