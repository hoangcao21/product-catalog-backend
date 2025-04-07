import { sha256 } from 'js-sha256';

import config from '../config';

export function doHashing(message: string): string {
  return sha256.hmac.create(config.SHA256_SECRET_KEY).update(message).hex();
}
