import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';

export class AuthApiModule {
  private static module: AuthApiModule;

  readonly authController: AuthController;

  private constructor(authModule: AuthModule) {
    this.authController = new AuthController(authModule.authService);
  }

  static async init() {
    if (!this.module) {
      const authModule = await AuthModule.init();

      this.module = new AuthApiModule(authModule);
    }

    return this.module;
  }
}
