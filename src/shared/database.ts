import * as dynamoose from 'dynamoose';

export function initDatabaseConnection() {
  // Create production-ready Dynamoose instance
  if (!['dev'].includes(process.env.NODE_ENV)) {
    const ddb = new dynamoose.aws.ddb.DynamoDB({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: 'ap-southeast-1',
    });

    dynamoose.aws.ddb.set(ddb);
  }
  // Create local Dynamoose instance
  else {
    // Default: http://localhost:8000
    dynamoose.aws.ddb.local();
  }
}
