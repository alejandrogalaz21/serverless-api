import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Customer, CustomerProps } from '../../domain/Customer';
import { ICustomerRepository, hydrateCustomer } from '../../domain/CustomerRepository';

/**
 * DynamoDB implementation of ICustomerRepository.
 */
export class DynamoCustomerRepository implements ICustomerRepository {
  private readonly tableName: string;

  constructor(private readonly doc: DynamoDBDocumentClient, tableName?: string) {
    this.tableName = tableName || process.env.CUSTOMER_TABLE || 'customers-dev';
  }

  public async create(customer: Customer): Promise<void> {
    const item = customer.toJSON();
    await this.doc.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
        ConditionExpression: 'attribute_not_exists(#id)',
        ExpressionAttributeNames: { '#id': 'id' },
      })
    );
  }

  public async getById(id: string): Promise<Customer | null> {
    const res = await this.doc.send(new GetCommand({ TableName: this.tableName, Key: { id } }));
    if (!res.Item) return null;
    return hydrateCustomer(res.Item as CustomerProps);
  }

  public async update(customer: Customer): Promise<void> {
    // For simplicity, replace the whole item
    await this.doc.send(new PutCommand({ TableName: this.tableName, Item: customer.toJSON() }));
  }

  public async delete(id: string): Promise<void> {
    await this.doc.send(new DeleteCommand({ TableName: this.tableName, Key: { id } }));
  }

  public async listAll(): Promise<Customer[]> {
    const res = await this.doc.send(new ScanCommand({ TableName: this.tableName }));
    const items = (res.Items || []) as CustomerProps[];
    return items.map(hydrateCustomer);
  }
}
