import * as dynamoose from 'dynamoose';

import config from '../config';

/**
 * Be aware that
 */

export async function initDatabaseConnection() {
  if (config.NODE_ENV === 'dev') {
    (await dynamoose.logger()).providers.set(console);
  }

  console.log('✅ Dynamoose Logger is enabled');

  console.log('🔃 Connect to database...', { NODE_ENV: config.NODE_ENV });

  // Create production-ready Dynamoose instance
  if (!['dev'].includes(config.NODE_ENV)) {
    const ddb = new dynamoose.aws.ddb.DynamoDB({
      region: 'ap-southeast-1',
    });

    dynamoose.aws.ddb.set(ddb);
  }
  // Create local Dynamoose instance
  else {
    // Default: http://localhost:8000
    dynamoose.aws.ddb.local(
      `${config.DYNAMO_DB_ENDPOINT}:${config.DYNAMO_DB_PORT}`,
    );
  }
}
