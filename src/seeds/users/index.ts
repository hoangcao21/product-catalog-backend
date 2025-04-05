import Chance from 'chance';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserModel } from 'src/modules/user/entities/user.repository';
import { UserEntityBuilder } from 'src/shared/builders/user-entity.builder';
import { doHashing } from 'src/shared/crypto';

export async function seedUpUsers() {
  const chance = new Chance();

  console.log('🔃 Preparing seeding data for UserTable...');

  const seedData: UserEntity[] = new Array(10).fill(1).map(() =>
    new UserEntityBuilder()
      .buildUserId(chance.guid({ version: 4 }))
      .buildUserName(chance.twitter().substring(1))
      .buildHashedPassword(doHashing('123456@abc'))
      .getResult(),
  );

  seedData.push(
    new UserEntityBuilder()
      .buildUserId(chance.guid({ version: 4 }))
      .buildUserName('sampleuser')
      .buildHashedPassword(doHashing('123456@abc'))
      .getResult(),
  );

  console.log('✅ Seeding data for UserTable is ready');

  console.log('🔃 Seeding data into UserTable...');

  await Promise.all(seedData.map((data) => data.save()));

  const result = await UserModel.scan().count().exec();

  console.log('✅ Data is seeded into UserTable', { result });
}

export async function seedDownUsers() {
  const result = await UserModel.scan().attribute('userId').all().exec();

  console.log('🔃 Deleting data from UserTable...', { result });

  try {
    if (result.count) {
      await UserModel.batchDelete(result.map((val) => val.userId));

      console.log('✅ Deleted data from UserTable');
    }
  } catch (err) {
    console.log(
      '🔃 Failed to batch delete. Deleting each item from UserTable...',
      { result, err },
    );

    await Promise.all(result.map((val) => val.delete()));

    console.log('✅ Deleted data from UserTable');
  }

  console.log('ℹ️ Finish seed down');
}
