import middy from '@middy/core';
import { AuthModule } from 'src/modules/auth/auth.module';
import {
  AuthService,
  CredentialCookieKey,
} from 'src/modules/auth/auth.service';

import { UnauthorizedError } from '../errors/http';

export const auth = (cookieKey: CredentialCookieKey) => {
  const before: middy.MiddlewareFn = async ({ event }) => {
    const apiEvent = event;

    const rawCookie: string =
      apiEvent.headers['cookie'] || apiEvent.headers['Cookie'];

    if (!rawCookie) {
      throw new UnauthorizedError(
        'COOKIE_NOT_FOUND_ERR',
        'Cookie is not present in headers',
      );
    }

    const authService: AuthService = (await AuthModule.init()).authService;

    const allowed = authService.allow(rawCookie, cookieKey);

    if (!allowed) {
      throw new UnauthorizedError(
        'AUTHENTICATION_FAILED_ERROR',
        'Cookie is invalid',
      );
    }

    console.log('💂 Cookie is valid!');
  };

  return {
    before,
  };
};
