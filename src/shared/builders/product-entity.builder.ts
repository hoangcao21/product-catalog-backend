import { ObjectType } from 'dynamoose/dist/General';
import { AttributeMap } from 'dynamoose/dist/Types';
import {
  ProductCategory,
  ProductEntity,
} from 'src/modules/product/entities/product.entity';
import { ProductModel } from 'src/modules/product/entities/product.repository';

import { BaseBuilder } from './base.builder';

export class ProductEntityBuilder extends BaseBuilder<ProductEntity> {
  protected object: AttributeMap | ObjectType = {};

  buildProductId(value: string) {
    this.object.productId = value;

    return this;
  }

  buildName(value: string) {
    this.object.name = value;
    this.object.nameLowercase = value.toLowerCase();

    return this;
  }

  buildDescription(value: string) {
    this.object.description = value;

    return this;
  }

  buildPrice(value: number) {
    this.object.price = value;

    return this;
  }

  buildCategory(value: ProductCategory) {
    this.object.category = value;
    this.object.categoryLowercase = value.toLowerCase();

    return this;
  }

  buildImageUrl(value: string) {
    this.object.imageUrl = value;

    return this;
  }

  getResult: () => ProductEntity = () => {
    return new ProductModel(this.object);
  };
}
