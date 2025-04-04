import { doHashing } from 'src/shared/crypto';
import { BadRequestError } from 'src/shared/errors/http';

import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import {
  CookieCredentials,
  CookieService,
  CredentialCookieKey,
  JwtAccessTokenPayload,
  JwtRefreshTokenPayload,
} from './cookie.service';

export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly cookieService: CookieService,
  ) {}

  async authenticate(
    userName: string,
    password: string,
  ): Promise<CookieCredentials> {
    const userEntity: UserEntity =
      await this.userService.getUserByUserName(userName);

    if (!userEntity) {
      console.log('❌ Failed to authenticate. User is not existing in DB', {
        userName,
      });

      throw new BadRequestError(
        'AUTHENTICATION_ERROR',
        'Failed to authenticate with provided credentials',
      );
    }

    const hashedPwd: string = doHashing(password);

    if (userEntity.hashedPassword !== hashedPwd) {
      throw new BadRequestError(
        'AUTHENTICATION_ERROR',
        'Failed to authenticate with provided credentials',
      );
    }

    return {
      accessTokenCookie:
        this.cookieService.generateAccessTokenCookie(userEntity),
      refreshTokenCookie:
        this.cookieService.generateRefreshTokenCookie(userEntity),
    };
  }

  async refresh(refreshTokenCookie: string): Promise<CookieCredentials> {
    try {
      const refreshTokenPayload: JwtRefreshTokenPayload =
        this.cookieService.transformCookieIntoJwtPayload<JwtRefreshTokenPayload>(
          refreshTokenCookie,
          'cookie_refresh_token',
        );

      const userEntity: UserEntity = await this.userService.getUserByUserName(
        refreshTokenPayload.userName,
      );

      if (!userEntity) {
        console.log('❌ Failed to authenticate. User is not existing in DB', {
          userName: refreshTokenPayload.userName,
        });

        throw new BadRequestError(
          'AUTHENTICATION_ERROR',
          'Failed to authenticate with provided credentials',
        );
      }

      return {
        accessTokenCookie:
          this.cookieService.generateAccessTokenCookie(userEntity),
        refreshTokenCookie:
          this.cookieService.generateRefreshTokenCookie(userEntity),
      };
    } catch (error) {
      console.log('❌ Token is unverified', { details: error });

      throw new BadRequestError(
        'INVALID_TOKEN_ERROR',
        'Failed to verify token',
      );
    }
  }

  allow<T extends JwtAccessTokenPayload | JwtRefreshTokenPayload>(
    cookieString: string,
    cookieKey: CredentialCookieKey,
  ): boolean {
    try {
      return !!this.cookieService.transformCookieIntoJwtPayload<T>(
        cookieString,
        cookieKey,
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  }
}
