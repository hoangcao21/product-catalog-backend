import * as cookie from 'cookie';
import jsonwebtoken from 'jsonwebtoken';
import { DateTime } from 'luxon';
import ms from 'ms';
import { doHashing } from 'src/shared/crypto';
import { BadRequestError } from 'src/shared/errors/http';

import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// eslint-disable-next-line @typescript-eslint/prefer-as-const
const ACCESS_TOKEN_COOKIE_KEY: 'cookie_access_token' = 'cookie_access_token';
// eslint-disable-next-line @typescript-eslint/prefer-as-const
const REFRESH_TOKEN_COOKIE_KEY: 'cookie_refresh_token' = 'cookie_refresh_token';

export type CredentialCookieKey =
  | typeof ACCESS_TOKEN_COOKIE_KEY
  | typeof REFRESH_TOKEN_COOKIE_KEY;

export interface JwtAccessTokenPayload {
  userId: string;
  userName: string;
  expiresAt: string;
}

export interface JwtRefreshTokenPayload {
  userId: string;
  userName: string;
  expiresAt: string;
  refreshToken: boolean;
}

export interface CookieCredentials {
  accessTokenCookie: string;
  refreshTokenCookie: string;
}

export class AuthService {
  constructor(private readonly userService: UserService) {}

  private generateAccessTokenCookie(userEntity: UserEntity): string {
    const thirtyMinutes: ms.StringValue = '30 minutes';

    const accessTokenExpiresInMilliseconds = ms(thirtyMinutes);

    const accessTokenExpiresAt = DateTime.now()
      .plus({ milliseconds: accessTokenExpiresInMilliseconds })
      .toUTC();

    const signedAccessToken = jsonwebtoken.sign(
      {
        userName: userEntity.userName,
        userId: userEntity.userId,
        expiresAt: accessTokenExpiresAt.toISO(),
      } as JwtAccessTokenPayload,
      JWT_SECRET_KEY,
      { expiresIn: thirtyMinutes },
    );

    const accessTokenCookie = cookie.serialize(
      ACCESS_TOKEN_COOKIE_KEY,
      signedAccessToken,
      { httpOnly: true, path: '/', expires: accessTokenExpiresAt.toJSDate() },
    );

    return accessTokenCookie;
  }

  private generateRefreshTokenCookie(userEntity: UserEntity): string {
    const sevenDays: ms.StringValue = '7 days';

    const refreshTokenExpiresInMilliseconds = ms(sevenDays);

    const refreshTokenExpiresAt = DateTime.now()
      .plus({ milliseconds: refreshTokenExpiresInMilliseconds })
      .toUTC();

    const signedRefreshToken = jsonwebtoken.sign(
      {
        userId: userEntity.userId,
        userName: userEntity.userName,
        refreshToken: true,
        expiresAt: refreshTokenExpiresAt.toISO(),
      } as JwtRefreshTokenPayload,
      JWT_SECRET_KEY,
      { expiresIn: sevenDays },
    );

    const refreshTokenCookie = cookie.serialize(
      REFRESH_TOKEN_COOKIE_KEY,
      signedRefreshToken,
      { httpOnly: true, path: '/', expires: refreshTokenExpiresAt.toJSDate() },
    );

    return refreshTokenCookie;
  }

  private verifyAndParseJwtToken<T extends object>(token: string): T {
    return jsonwebtoken.verify(token, JWT_SECRET_KEY) as T;
  }

  private transformCookieIntoJwtPayload<
    T extends JwtAccessTokenPayload | JwtRefreshTokenPayload,
  >(
    cookieString: string,
    cookieKey: typeof ACCESS_TOKEN_COOKIE_KEY | typeof REFRESH_TOKEN_COOKIE_KEY,
  ): T {
    const cookieObject = cookie.parse(cookieString);

    const jwtToken = cookieObject[cookieKey];

    const token: T = this.verifyAndParseJwtToken<T>(jwtToken);

    return token;
  }

  async authenticate(
    userName: string,
    password: string,
  ): Promise<CookieCredentials> {
    const userEntity: UserEntity = await this.userService.getUser(userName);

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
      accessTokenCookie: this.generateAccessTokenCookie(userEntity),
      refreshTokenCookie: this.generateRefreshTokenCookie(userEntity),
    };
  }

  async refresh(refreshTokenCookie: string): Promise<CookieCredentials> {
    try {
      const refreshTokenPayload: JwtRefreshTokenPayload =
        this.transformCookieIntoJwtPayload<JwtRefreshTokenPayload>(
          refreshTokenCookie,
          REFRESH_TOKEN_COOKIE_KEY,
        );

      const userEntity: UserEntity = await this.userService.getUser(
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
        accessTokenCookie: this.generateAccessTokenCookie(userEntity),
        refreshTokenCookie: this.generateRefreshTokenCookie(userEntity),
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
      return !!this.transformCookieIntoJwtPayload<T>(cookieString, cookieKey);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  }
}
