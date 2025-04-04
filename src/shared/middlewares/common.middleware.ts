import cors from '@middy/http-cors';
import jsonBodyParser from '@middy/http-json-body-parser';
import inputOutputLogger from '@middy/input-output-logger';

import { handleError } from './handle-error.middleware';

export const COMMON_MIDDLEWARES = [
  inputOutputLogger({
    logger: (request) => {
      if (request.event) {
        console.log('➡️ Incoming request ', request.event);
      }

      if (request.response) {
        console.log('⬅️ Outgoing response ', request.response);
      }
    },
    awsContext: true,
  }),
  cors({ origin: '*', headers: 'Content-Type', credentials: true }),
  jsonBodyParser({ disableContentTypeError: true }),
  handleError(),
];
