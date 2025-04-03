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

export const parseAndValidateBody = <
  S extends z.ZodSchema,
  T extends z.infer<S>,
>(
  schema: S,
  dtoConstructor: new (props: unknown) => T,
) => {
  const before: middy.MiddlewareFn = async ({ event }) => {
    const result = event as ValidatedApiEvent<T>;
    result.validatedPayload = schema
      .transform<T>((props) => new dtoConstructor(props))
      .parse(event.body);
  };

  return {
    before,
  };
};
export const parseAndValidatePathParams = <S extends z.ZodSchema>(
  schema: S,
) => {
  const before: middy.MiddlewareFn = async ({ event }) => {
    const result = event as ValidatedApiEvent<z.infer<typeof schema>>;

    result.validatedPayload = schema.parse(event.pathParameters);
  };
  return {
    before,
  };
};

export const parseAndValidateRequest = <
  PathParamsSchema extends z.ZodSchema,
  QuerySchema extends z.ZodSchema,
  BodySchema extends z.ZodSchema,
  T,
>(
  dtoConstructor: new (props: T) => T,
  pathParamsSchema?: PathParamsSchema,
  querySchema?: QuerySchema,
  bodySchema?: BodySchema,
) => {
  const before: middy.MiddlewareFn = async ({ event }) => {
    const result = event as ValidatedApiEvent<T>;

    const props: T = {
      ...(pathParamsSchema ? pathParamsSchema.parse(event.pathParameters) : {}),
      ...(querySchema
        ? querySchema.parse(event.queryStringParameters || {})
        : {}),
      ...(bodySchema ? bodySchema.parse(event.body) : {}),
    };

    result.validatedPayload = new dtoConstructor(props);
  };
  return {
    before,
  };
};
