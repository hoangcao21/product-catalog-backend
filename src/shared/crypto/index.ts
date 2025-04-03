import { sha256 } from 'js-sha256';

const SHA256_SECRET_KEY = process.env.SHA256_SECRET_KEY;

export function doHashing(message: string): string {
  return sha256.hmac.create(SHA256_SECRET_KEY).update(message).hex();
}
