import { CursorUtils, DynamooseCursor } from '../cursor';
import { PaginatedResponseBody } from '../dto/response';

export class PaginationQueryResponse<T> {
  readonly result: T[];

  readonly nextCursor: string; // String in Base64 format

  constructor(result: T[], nextCursor: DynamooseCursor) {
    this.result = result;
    this.nextCursor = CursorUtils.toBase64(nextCursor);
  }

  toPaginatedResponseBody<R>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor: { from: (val: T, ...args: any) => R },
  ): PaginatedResponseBody<R> {
    const results: R[] = this.result?.length
      ? this.result.map((val) => constructor.from(val))
      : [];

    return new PaginatedResponseBody(true, results, this.nextCursor);
  }
}
