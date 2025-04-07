import { seedUpUsers } from 'src/seeds/users';
import config from 'src/shared/config';
import { initDatabaseConnection } from 'src/shared/database/database-connection';

import {
  UserModel,
  UserRepository,
  createUserTable,
} from './entities/user.repository';
import { UserService } from './user.service';

export class UserModule {
  private static module: UserModule;

  private constructor(readonly userService: UserService) {}

  static async init(): Promise<UserModule> {
    if (!this.module) {
      await initDatabaseConnection();

      await createUserTable();

      if (config.NODE_ENV !== 'dev') {
        const count = await UserModel.scan().all().count().exec();

        if (count.count === 0) {
          console.log('🔃 Seeding up users for non-dev environment');

          await seedUpUsers();
        }
      }

      const userService: UserService = new UserService(new UserRepository());

      this.module = new UserModule(userService);
    }

    return this.module;
  }
}
