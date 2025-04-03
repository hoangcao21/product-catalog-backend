import { Item } from 'dynamoose/dist/Item';

export enum ProductCategory {
  Food = 'food',
  Tech = 'tech',
  Lifestyle = 'lifestyle',
}

export class ProductEntity extends Item {
  productId: string;
  name: string;
  nameLowercase: string; // for search by partial matching
  description: string;
  price: number;
  category: ProductCategory;
  categoryLowercase: string; // for search by exact matching (GSI)
  imageUrl: string;
}
