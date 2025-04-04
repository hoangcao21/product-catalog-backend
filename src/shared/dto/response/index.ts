import { APIGatewayProxyResult } from 'aws-lambda';
import HttpStatus from 'http-status';

export class StandardResponseBody<R> {
  constructor(
    readonly success: boolean,
    readonly result: R,
  ) {}
}

export class PaginatedResponseBody<R> {
  constructor(
    readonly success: boolean,
    readonly result: R[],
    readonly nextCursor?: string,
  ) {}
}

export class HttpResponse<B> {
  constructor(
    readonly statusCode: number,
    readonly body?: B,
    readonly extraHeaders?: Record<string, string>,
    readonly multiValueHeaders?: {
      [header: string]: (string | number | boolean)[];
    },
  ) {}

  toGatewayResult(): APIGatewayProxyResult {
    return {
      statusCode: this.statusCode,
      multiValueHeaders: {
        ...this.multiValueHeaders,
      },
      headers: {
        'Content-Type': 'application/json',
        ...(this.extraHeaders || {}),
      },
      body: this.body ? JSON.stringify(this.body) : undefined,
    };
  }
}

export class OkResponse<B> extends HttpResponse<B> {
  constructor(
    body: B,
    extraHeaders?: Record<string, string>,
    multiValueHeaders?: {
      [header: string]: (string | number | boolean)[];
    },
  ) {
    super(HttpStatus.OK, body, extraHeaders, multiValueHeaders);
  }

  static fromResult<R>(
    result: R,
    extraHeaders?: Record<string, string>,
    multiValueHeaders?: {
      [header: string]: (string | number | boolean)[];
    },
  ): OkResponse<StandardResponseBody<R>> {
    return new OkResponse(
      new StandardResponseBody(true, result),
      extraHeaders,
      multiValueHeaders,
    );
  }

  static fromPagination<R>(
    response: PaginatedResponseBody<R>,
  ): OkResponse<PaginatedResponseBody<R>> {
    return new OkResponse(response);
  }
}
