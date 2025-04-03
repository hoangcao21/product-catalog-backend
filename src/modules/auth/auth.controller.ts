import { OkResponse } from 'src/shared/dto/response';

import { AuthService, CookieCredentials } from './auth.service';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(userName: string, password: string) {
    const cookies: CookieCredentials = await this.authService.authenticate(
      userName,
      password,
    );

    return OkResponse.fromResult(undefined, undefined, {
      'Set-Cookie': [cookies.accessTokenCookie, cookies.refreshTokenCookie],
    });
  }
}
