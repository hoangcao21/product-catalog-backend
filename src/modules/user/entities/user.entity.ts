import { Item } from 'dynamoose/dist/Item';

export class UserEntity extends Item {
  userId: string;
  userName: string;
  hashedPassword: string;
}
