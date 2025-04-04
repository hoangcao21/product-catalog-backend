import middy from '@middy/core';
import httpRouterHandler, { Method, Route } from '@middy/http-router';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
  GetProductQueryDto,
  getProductsQuerySchema,
} from 'src/modules/product/dtos/request/get-product.query.dto';
import {
  IProductIdPathParamSchema,
  productIdPathParamSchema,
} from 'src/modules/product/dtos/request/product-id.path-parms.dto';
import { ProductApiModule } from 'src/modules/product/product.api.module';
import { auth } from 'src/shared/middlewares/auth.middleware';
import { COMMON_MIDDLEWARES } from 'src/shared/middlewares/common.middleware';
import {
  ValidatedApiEvent,
  parseAndValidatePathParams,
  parseAndValidateQuery,
} from 'src/shared/middlewares/parse-and-validate.middleware';

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
];

export const handler = middy()
  .use(COMMON_MIDDLEWARES)
  .use(auth('cookie_access_token'))
  .handler(httpRouterHandler(routes));
