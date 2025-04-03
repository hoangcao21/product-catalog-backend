import middy from '@middy/core';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { z } from 'zod';

export interface ValidatedApiEvent<T> extends APIGatewayProxyEvent {
  validatedPayload?: T;
}

export const parseAndValidateQuery = <S extends z.ZodSchema, T>(
  schema: S,
  dtoConstructor: new (props: unknown) => T,
) => {
  const before: middy.MiddlewareFn = async ({ event }) => {
    const result = event as ValidatedApiEvent<T>;

    result.validatedPayload = schema
      .transform<T>((props) => new dtoConstructor(props))
      .parse(event.queryStringParameters || {});
  };
  return {
    before,
  };
};
