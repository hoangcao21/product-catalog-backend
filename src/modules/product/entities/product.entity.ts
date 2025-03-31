import { Item } from 'dynamoose/dist/Item';

export class ProductEntity extends Item {
  productId: string;
  name: string;
  nameLowercase: string; // for search by pattern matching
  description: string;
  price: number;
  category: string;
  categoryLowercase: string; // for search by pattern matching
  imageUrl: string;
}
