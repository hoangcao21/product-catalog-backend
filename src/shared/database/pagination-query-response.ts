import { CursorUtils, DynamooseCursor } from '../cursor';

export class PaginationQueryResponse<T> {
  readonly result: T[];

  readonly nextCursor: string; // String in Base64 format

  constructor(result: T[], nextCursor: DynamooseCursor) {
    this.result = result;
    this.nextCursor = CursorUtils.toBase64(nextCursor);
  }
}
