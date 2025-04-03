import { APIGatewayProxyResult } from 'aws-lambda';
import HttpStatus from 'http-status';

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    public code: string = 'GENERIC_ERROR',
    message: string,
    public cause?: object,
  ) {
    super(message);
  }

  toResponse(): APIGatewayProxyResult {
    return {
      statusCode: this.statusCode,
      body: JSON.stringify({
        code: this.code,
        message: this.message,
        cause: this.cause,
      }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
}

export class BadRequestError extends HttpError {
  constructor(
    public code: string = 'BAD_REQUEST_ERROR',
    message: string,
    public cause?: object,
  ) {
    super(HttpStatus.BAD_REQUEST, code, message, cause);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(
    public code: string = 'UNAUTHORIZED_ERROR',
    message: string,
    public cause?: object,
  ) {
    super(HttpStatus.UNAUTHORIZED, code, message, cause);
  }
}
