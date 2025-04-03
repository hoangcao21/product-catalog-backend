import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';

export class AuthModule {
  private static module: AuthModule;
  readonly authService: AuthService;

  private constructor(readonly userModule: UserModule) {
    this.authService = new AuthService(userModule.userService);
  }

  static async init(): Promise<AuthModule> {
    if (!this.module) {
      const userModule = await UserModule.init();

      this.module = new AuthModule(userModule);
    }

    return this.module;
  }
}
