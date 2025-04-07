const config = {
  NODE_ENV: process.env.NODE_ENV,
  DYNAMO_DB_ENDPOINT: process.env.DYNAMO_DB_ENDPOINT,
  DYNAMO_DB_PORT: process.env.DYNAMO_DB_PORT,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  SHA256_SECRET_KEY: process.env.SHA256_SECRET_KEY,
};

console.log('ℹ️ Loaded configuration', config);

export default config;
