import { initDatabaseConnection } from 'src/shared/database/database-connection';

import { UserRepository, createUserTable } from './entities/user.repository';
import { UserService } from './user.service';

export class UserModule {
  private static module: UserModule;

  private constructor(readonly userService: UserService) {}

  static async init(): Promise<UserModule> {
    if (!this.module) {
      await initDatabaseConnection();

      await createUserTable();

      const userService: UserService = new UserService(new UserRepository());

      this.module = new UserModule(userService);
    }

    return this.module;
  }
}
