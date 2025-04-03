export class ProductDto {
  constructor(props: ProductDto) {
    Object.assign(this, props);
  }

  productId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}
