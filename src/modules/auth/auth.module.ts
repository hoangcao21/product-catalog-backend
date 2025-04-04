import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';

export class AuthModule {
  private static module: AuthModule;
  readonly authService: AuthService;
  readonly cookieService: CookieService;

  private constructor(readonly userModule: UserModule) {
    this.cookieService = new CookieService();

    this.authService = new AuthService(
      userModule.userService,
      this.cookieService,
    );
  }

  static async init(): Promise<AuthModule> {
    if (!this.module) {
      const userModule = await UserModule.init();

      this.module = new AuthModule(userModule);
    }

    return this.module;
  }
}
