import { CreateTableCommand, DescribeTableCommand, DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb';
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

/**
 * Ensure the customer table exists locally. No-op in AWS.
 */
export async function ensureTableExists(tableName: string): Promise<void> {
  const isOffline = process.env.IS_OFFLINE === 'true' || process.env.IS_OFFLINE === '1';
  const endpoint = process.env.DYNAMODB_ENDPOINT || (isOffline ? 'http://localhost:8000' : undefined);
  if (!endpoint) return; // don't attempt on AWS

  const client = new DynamoDBClient({
    region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-2',
    endpoint,
    credentials: { accessKeyId: 'local', secretAccessKey: 'local' },
  });

  try {
    const list = await client.send(new ListTablesCommand({}));
    if (list.TableNames?.includes(tableName)) return;
  } catch (e) {
    // continue and attempt to create
  }

  try {
    await client.send(
      new CreateTableCommand({
        TableName: tableName,
        AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
        BillingMode: 'PAY_PER_REQUEST',
      })
    );
    // Optionally wait until active
    let active = false;
    for (let i = 0; i < 10 && !active; i++) {
      await new Promise(r => setTimeout(r, 300));
      const desc = await client.send(new DescribeTableCommand({ TableName: tableName }));
      active = desc.Table?.TableStatus === 'ACTIVE';
    }
  } catch (err: any) {
    // If another process created it, ignore ResourceInUse
    if (err?.name !== 'ResourceInUseException') {
      console.warn('Failed to ensure local DynamoDB table exists:', err);
    }
  }
}
