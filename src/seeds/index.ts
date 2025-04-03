import { createProductTable } from 'src/modules/product/entities/product.repository';
import { initDatabaseConnection } from 'src/shared/database/database-connection';

import { seedDownProducts, seedUpProducts } from './products';

const shouldSeedUp = process.argv[2] === 'up';

async function seedUp() {
  createProductTable().then(() => {
    seedUpProducts();
  });
}

async function seedDown() {
  createProductTable().then(() => {
    seedDownProducts();
  });
}

initDatabaseConnection().then(() => {
  if (shouldSeedUp) {
    seedUp();
  } else {
    seedDown();
  }
});
