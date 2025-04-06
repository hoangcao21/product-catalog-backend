import * as dynamoose from 'dynamoose';

/**
 * Be aware that
 */

export async function initDatabaseConnection() {
  if (process.env.NODE_ENV === 'dev') {
    (await dynamoose.logger()).providers.set(console);
  }

  console.log('✅ Dynamoose Logger is enabled');

  console.log('🔃 Connect to database...', { NODE_ENV: process.env.NODE_ENV });

  // Create production-ready Dynamoose instance
  if (!['dev'].includes(process.env.NODE_ENV)) {
    const ddb = new dynamoose.aws.ddb.DynamoDB({
      region: 'ap-southeast-1',
    });

    dynamoose.aws.ddb.set(ddb);
  }
  // Create local Dynamoose instance
  else {
    // Default: http://localhost:8000
    dynamoose.aws.ddb.local(
      `${process.env.DYNAMO_DB_ENDPOINT}:${process.env.DYNAMO_DB_PORT}`,
    );
  }
}
