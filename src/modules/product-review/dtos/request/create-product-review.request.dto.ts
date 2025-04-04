export class CreateProductReviewRequestDto {
  constructor(props: CreateProductReviewRequestDto) {
    Object.assign(this, props);
  }

  productId: string;
  rating: number;
  comment: string;
}
