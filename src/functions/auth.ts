import middy from '@middy/core';
import httpRouterHandler, { Method, Route } from '@middy/http-router';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { AuthApiModule } from 'src/modules/auth/auth.api.module';
import { LoginDto, loginSchema } from 'src/modules/auth/dtos/request/login.dto';
import { COMMON_MIDDLEWARES } from 'src/shared/middlewares/common.middleware';
import {
  ValidatedApiEvent,
  parseAndValidateBody,
} from 'src/shared/middlewares/parse-and-validate.middleware';

const postLoginHandler = async (
  event: ValidatedApiEvent<LoginDto>,
): Promise<APIGatewayProxyResult> => {
  const authApiModule = await AuthApiModule.init();
  const controller = authApiModule.authController;

  const { userName, password } = event.validatedPayload;

  return (await controller.login(userName, password)).toGatewayResult();
};

const routes: Route<APIGatewayProxyEvent, unknown>[] = [
  {
    method: 'POST' as Method,
    path: '/auth/login',
    handler: middy()
      .use(
        parseAndValidateBody<typeof loginSchema, LoginDto>(
          loginSchema,
          LoginDto,
        ),
      )
      .handler(postLoginHandler),
  },
];

export const handler = middy()
  .use(COMMON_MIDDLEWARES)
  .handler(httpRouterHandler(routes));
