import { Item } from 'dynamoose/dist/Item';
import { Query, Scan } from 'dynamoose/dist/ItemRetriever';

import { CursorUtils, DynamooseCursor } from '../cursor';
import { DynamooseModelType } from './dynamoose-model-type';
import { PaginationQueryResponse } from './pagination-query-response';

export class Repository<T extends Item = Item> {
  constructor(protected readonly model: DynamooseModelType<T>) {}

  protected async paginate(
    operation: Query<T> | Scan<T>,
    cursor: string, // If cursor is not provided, then start from the first item. In other words, `cursor` is undefined
    limit: number,
  ): Promise<PaginationQueryResponse<T>> {
    operation = operation.limit(limit);

    if (cursor) {
      operation = operation.startAt(CursorUtils.toCursorObject(cursor)); // Start at the provided cursor
    }

    const results = await operation.exec();

    const items: T[] = results.map((val) => val as T); // Need to force casting to type "T"
    const nextCursor: DynamooseCursor = results.lastKey || null; // Next page starting point

    return new PaginationQueryResponse(items, nextCursor);
  }
}
