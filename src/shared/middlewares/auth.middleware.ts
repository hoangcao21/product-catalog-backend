import middy from '@middy/core';
import { APIGatewayProxyEvent } from 'aws-lambda';
import * as cookie from 'cookie';
import { AuthModule } from 'src/modules/auth/auth.module';
import {
  AuthService,
  CredentialCookieKey,
} from 'src/modules/auth/auth.service';

import { UnauthorizedError } from '../errors/http';

export interface SessionApiEvent extends APIGatewayProxyEvent {
  'x-cookie'?: string;
}

export const auth = (
  cookieKey: CredentialCookieKey,
  extract: boolean = false,
) => {
  const before: middy.MiddlewareFn = async ({ event }) => {
    const apiEvent = event as SessionApiEvent;

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

    if (extract) {
      apiEvent['x-cookie'] =
        `${cookieKey}=${cookie.parse(rawCookie)[cookieKey]}`;
    }

    console.log('💂 Cookie is valid!');
  };

  return {
    before,
  };
};
