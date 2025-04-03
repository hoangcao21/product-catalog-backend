import middy from '@middy/core';
import HttpStatus from 'http-status';
import { z } from 'zod';

import { BadRequestError, HttpError } from '../errors/http';

export const handleError = (): middy.MiddlewareObj => {
  const onError: middy.MiddlewareFn = async (request): Promise<void> => {
    const { error } = request;

    console.log('Error caught in `handleError` middleware', error);

    // Avoid handling normal response
    if (request.response !== undefined) return;

    const defaultResponse = {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: HttpStatus['500_NAME'],
        message: HttpStatus['500_MESSAGE'],
      }),
    };

    if (error instanceof HttpError) {
      request.response = error.toResponse();
    } else if (error instanceof z.ZodError) {
      request.response = new BadRequestError(
        'VALIDATION_ERROR',
        'Failed to validate DTO',
        error.issues,
      ).toResponse();
    } else {
      request.response = defaultResponse;
    }
  };

  return {
    onError,
  };
};
