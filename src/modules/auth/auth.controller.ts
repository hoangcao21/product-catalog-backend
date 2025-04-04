import { OkResponse, StandardResponseBody } from 'src/shared/dto/response';

import { AuthService } from './auth.service';
import { CookieCredentials } from './cookie.service';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(
    userName: string,
    password: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<OkResponse<StandardResponseBody<any>>> {
    const cookies: CookieCredentials = await this.authService.authenticate(
      userName,
      password,
    );

    console.log('✅ Authenticated successfully');

    return OkResponse.fromResult(undefined, undefined, {
      'Set-Cookie': [cookies.accessTokenCookie, cookies.refreshTokenCookie],
    });
  }

  async rotateCredentials(refreshTokenCookie: string) {
    const cookies: CookieCredentials =
      await this.authService.refresh(refreshTokenCookie);

    console.log('✅ Rotated credentials successfully');

    return OkResponse.fromResult(undefined, undefined, {
      'Set-Cookie': [cookies.accessTokenCookie, cookies.refreshTokenCookie],
    });
  }
}
