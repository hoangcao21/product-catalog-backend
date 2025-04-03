import * as dynamoose from 'dynamoose';
import { Item } from 'dynamoose/dist/Item';

export type DynamooseModelType<T extends Item> = ReturnType<
  typeof dynamoose.model<T>
>;
