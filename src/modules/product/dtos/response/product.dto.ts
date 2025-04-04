import { ProductReviewDto } from 'src/modules/product-review/dtos/response/product-review.dto';
import { ProductReviewEntity } from 'src/modules/product-review/entities/product-review.entity';

import { ProductEntity } from '../../entities/product.entity';

export class ProductDto {
  productId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  reviews?: ProductReviewDto[];

  static from(
    entity: ProductEntity,
    reviewEntities?: ProductReviewEntity[],
  ): ProductDto {
    const productDto = new ProductDto();

    productDto.productId = entity.productId;
    productDto.name = entity.name;
    productDto.description = entity.description;
    productDto.price = entity.price;
    productDto.category = entity.category;
    productDto.imageUrl = entity.imageUrl;
    productDto.reviews = reviewEntities?.length
      ? reviewEntities.map((val) => ProductReviewDto.from(val))
      : [];

    return productDto;
  }
}
