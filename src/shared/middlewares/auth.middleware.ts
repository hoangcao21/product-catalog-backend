import middy from '@middy/core';
import { APIGatewayProxyEvent } from 'aws-lambda';
import * as cookie from 'cookie';
import { AuthModule } from 'src/modules/auth/auth.module';
import { CredentialCookieKey } from 'src/modules/auth/cookie.service';

import { UnauthorizedError } from '../errors/http';

export interface SessionApiEvent extends APIGatewayProxyEvent {
  'x-cookie'?: string;
  userInformation?: { userId: string; userName: string };
}

export const auth = (
  cookieKey: CredentialCookieKey,
  extract: boolean = false,
) => {
  const before: middy.MiddlewareFn = async ({ event }) => {
    const apiEvent = event as SessionApiEvent;

    if (!apiEvent.headers) {
      throw new UnauthorizedError(
        'COOKIE_NOT_FOUND_ERR',
        'Cookie is not present in headers',
      );
    }

    const rawCookie: string =
      apiEvent.headers['cookie'] || apiEvent.headers['Cookie'];

    if (!rawCookie) {
      throw new UnauthorizedError(
        'COOKIE_NOT_FOUND_ERR',
        'Cookie is not present in headers',
      );
    }

    const { authService, cookieService } = await AuthModule.init();

    const allowed = authService.allow(rawCookie, cookieKey);

    if (!allowed) {
      throw new UnauthorizedError(
        'AUTHENTICATION_FAILED_ERROR',
        'Cookie is invalid',
      );
    }

    if (extract) {
      apiEvent['x-cookie'] =
        `${cookieKey}=${cookie.parse(rawCookie)[cookieKey]}`;

      const jwtPayload = cookieService.transformCookieIntoJwtPayload(
        rawCookie,
        cookieKey,
      );

      apiEvent.userInformation = {
        userId: jwtPayload.userId,
        userName: jwtPayload.userName,
      };
    }

    console.log('💂 Cookie is valid!');
  };

  return {
    before,
  };
};
