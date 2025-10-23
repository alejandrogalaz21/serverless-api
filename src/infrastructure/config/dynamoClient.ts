import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

/**
 * Create a configured DynamoDB DocumentClient.
 * Uses local endpoint when running offline.
 */
export function createDynamoDocumentClient() {
  const isOffline = process.env.IS_OFFLINE === 'true' || process.env.IS_OFFLINE === '1';
  const endpoint = process.env.DYNAMODB_ENDPOINT || (isOffline ? 'http://localhost:8000' : undefined);

  const client = new DynamoDBClient({
    region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-2',
    endpoint,
    credentials: endpoint
      ? { accessKeyId: 'local', secretAccessKey: 'local' } // required by SDK for local
      : undefined,
  });

  return DynamoDBDocumentClient.from(client, {
    marshallOptions: { removeUndefinedValues: true },
  });
}
