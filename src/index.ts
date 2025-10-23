import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createDynamoDocumentClient, ensureTableExists } from './infrastructure/config/dynamoClient';
import { DynamoCustomerRepository } from './infrastructure/repositories/DynamoCustomerRepository';
import { CustomerController } from './infrastructure/http/CustomerController';
import { CreateCustomer } from './application/use-cases/CreateCustomer';
import { GetCustomer } from './application/use-cases/GetCustomer';
import { UpdateCustomer } from './application/use-cases/UpdateCustomer';
import { DeleteCustomer } from './application/use-cases/DeleteCustomer';
import { AddCredit } from './application/use-cases/AddCredit';
import { ListCustomers } from './application/use-cases/ListCustomers';

// Dependency wiring (simple factory for cold start reuse)
const docClient = createDynamoDocumentClient();
const repo = new DynamoCustomerRepository(docClient);
const controller = new CustomerController(
  new CreateCustomer(repo),
  new GetCustomer(repo),
  new UpdateCustomer(repo),
  new DeleteCustomer(repo),
  new AddCredit(repo),
  new ListCustomers(repo)
);

/**
 * Lambda handler entry point.
 * Routes API Gateway events to the CustomerController.
 */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Ensure local table exists when running offline
  if (process.env.CUSTOMER_TABLE) {
    await ensureTableExists(process.env.CUSTOMER_TABLE);
  }
  return controller.handle(event);
};