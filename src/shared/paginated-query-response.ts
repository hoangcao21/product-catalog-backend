import { ObjectType } from 'dynamoose/dist/General';

import { CursorUtils } from './cursor';

export class PaginatedQueryDbResponse<T extends object> {
  readonly result: T[];

  readonly total: number;

  readonly cursor: string; // String in Base64 format

  constructor(result: T[], total: number, cursor: ObjectType) {
    this.result = result;
    this.total = total;
    this.cursor = CursorUtils.toBase64(cursor);
  }
}
