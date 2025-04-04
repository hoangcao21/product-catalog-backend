import middy from '@middy/core';
import { APIGatewayProxyResult } from 'aws-lambda';
import { OkResponse } from 'src/shared/dto/response';
import { COMMON_MIDDLEWARES } from 'src/shared/middlewares/common.middleware';

const preflightHandler = async (): Promise<APIGatewayProxyResult> => {
  return new OkResponse('').toGatewayResult();
};

export const handler = middy()
  .use(COMMON_MIDDLEWARES)
  .handler(preflightHandler);
