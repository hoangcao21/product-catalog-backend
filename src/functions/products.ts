import middy from '@middy/core';
import httpRouterHandler, { Method, Route } from '@middy/http-router';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CreateProductReviewRequestDto } from 'src/modules/product-review/dtos/request/create-product-review.request.dto';
import {
  GetProductQueryDto,
  getProductsQuerySchema,
} from 'src/modules/product/dtos/request/get-product.query.dto';
import {
  IProductIdPathParamSchema,
  productIdPathParamSchema,
} from 'src/modules/product/dtos/request/product-id.path-parms.dto';
import { ProductApiModule } from 'src/modules/product/product.api.module';
import { SessionApiEvent, auth } from 'src/shared/middlewares/auth.middleware';
import { COMMON_MIDDLEWARES } from 'src/shared/middlewares/common.middleware';
import {
  ValidatedApiEvent,
  parseAndValidatePathParams,
  parseAndValidateQuery,
  parseAndValidateRequest,
} from 'src/shared/middlewares/parse-and-validate.middleware';

import { createProductReviewBodySchema } from './../modules/product-review/dtos/request/create-product-review.body.dto';

const getProductsHandler = async (
  event: ValidatedApiEvent<GetProductQueryDto>,
): Promise<APIGatewayProxyResult> => {
  const productApiModule = await ProductApiModule.init();
  const controller = productApiModule.productController;

  return (
    await controller.getProducts(event.validatedPayload)
  ).toGatewayResult();
};

const getProductDetailHandler = async (
  event: ValidatedApiEvent<IProductIdPathParamSchema>,
): Promise<APIGatewayProxyResult> => {
  const productApiModule = await ProductApiModule.init();
  const controller = productApiModule.productController;

  return (
    await controller.getProductDetail(event.validatedPayload.productId)
  ).toGatewayResult();
};

const postProductReviewHandler = async (
  event: ValidatedApiEvent<CreateProductReviewRequestDto> & SessionApiEvent,
): Promise<APIGatewayProxyResult> => {
  const productApiModule = await ProductApiModule.init();
  const controller = productApiModule.productController;

  const { validatedPayload, userInformation } = event;

  return (
    await controller.createProductReview(
      userInformation.userId,
      validatedPayload.productId,
      validatedPayload.rating,
      validatedPayload.comment,
    )
  ).toGatewayResult();
};

const routes: Route<APIGatewayProxyEvent, unknown>[] = [
  {
    method: 'GET' as Method,
    path: '/products',
    handler: middy()
      .use(
        parseAndValidateQuery<
          typeof getProductsQuerySchema,
          GetProductQueryDto
        >(getProductsQuerySchema, GetProductQueryDto),
      )
      .handler(getProductsHandler),
  },
  {
    method: 'GET' as Method,
    path: '/products/{productId}',
    handler: middy()
      .use(
        parseAndValidatePathParams<typeof productIdPathParamSchema>(
          productIdPathParamSchema,
        ),
      )
      .handler(getProductDetailHandler),
  },
  {
    method: 'POST' as Method,
    path: '/products/{productId}/review',
    handler: middy()
      .use(
        parseAndValidateRequest<
          typeof productIdPathParamSchema,
          null,
          typeof createProductReviewBodySchema,
          CreateProductReviewRequestDto
        >(
          CreateProductReviewRequestDto,
          productIdPathParamSchema,
          null,
          createProductReviewBodySchema,
        ),
      )
      .handler(postProductReviewHandler),
  },
];

export const handler = middy()
  .use(COMMON_MIDDLEWARES)
  .use(auth('cookie_access_token', true))
  .handler(httpRouterHandler(routes));
