import { APIGatewayProxyResult } from 'aws-lambda';
import HttpStatus from 'http-status';
import { PaginationQueryResponse } from 'src/shared/database/pagination-query-response';

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
  ) {}

  toGatewayResult(): APIGatewayProxyResult {
    return {
      statusCode: this.statusCode,
      headers: {
        'Content-Type': 'application/json',
        ...(this.extraHeaders || {}),
      },
      body: this.body ? JSON.stringify(this.body) : undefined,
    };
  }
}

export class OkResponse<B> extends HttpResponse<B> {
  constructor(body: B, extraHeaders?: Record<string, string>) {
    super(HttpStatus.OK, body, extraHeaders);
  }

  static fromResult<R>(result: R): OkResponse<StandardResponseBody<R>> {
    return new OkResponse(new StandardResponseBody(true, result));
  }

  static fromPagination<R>(
    response: PaginationQueryResponse<R>,
  ): OkResponse<PaginatedResponseBody<R>> {
    return new OkResponse(
      new PaginatedResponseBody(true, response.result, response.nextCursor),
    );
  }
}
