import { createProductTable } from 'src/modules/product/entities/product.repository';
import { createUserTable } from 'src/modules/user/entities/user.repository';
import { initDatabaseConnection } from 'src/shared/database/database-connection';

import { seedDownProducts, seedUpProducts } from './products';
import { seedDownUsers, seedUpUsers } from './users';

const shouldSeedUp = process.argv[2] === 'up';

async function seedUp() {
  createProductTable().then(() => {
    seedUpProducts();
  });

  createUserTable().then(() => {
    seedUpUsers();
  });
}

async function seedDown() {
  createProductTable().then(() => {
    seedDownProducts();
  });

  createUserTable().then(() => {
    seedDownUsers();
  });
}

initDatabaseConnection().then(() => {
  if (shouldSeedUp) {
    seedUp();
  } else {
    seedDown();
  }
});
