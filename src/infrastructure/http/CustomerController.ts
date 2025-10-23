import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { json, noContent } from './HttpResponse';
import { CreateCustomer } from '../../application/use-cases/CreateCustomer';
import { GetCustomer } from '../../application/use-cases/GetCustomer';
import { UpdateCustomer } from '../../application/use-cases/UpdateCustomer';
import { DeleteCustomer } from '../../application/use-cases/DeleteCustomer';
import { AddCredit } from '../../application/use-cases/AddCredit';
import { ListCustomers } from '../../application/use-cases/ListCustomers';
import { DomainError, NotFoundError, ValidationError } from '../../domain/errors/DomainError';

/**
 * Controller for API Gateway events related to Customer.
 */
export class CustomerController {
  constructor(
    private readonly createCustomer: CreateCustomer,
    private readonly getCustomer: GetCustomer,
    private readonly updateCustomer: UpdateCustomer,
    private readonly deleteCustomer: DeleteCustomer,
    private readonly addCredit: AddCredit,
    private readonly listCustomers: ListCustomers
  ) {}

  /** Main entry point to handle API Gateway event */
  public async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const { httpMethod, path, pathParameters } = event;

      if (httpMethod === 'GET' && path?.endsWith('/customers')) {
        const sortByCredit = this.readBooleanQuery(event.queryStringParameters, 'sortByCredit');
        const customers = await this.listCustomers.execute(!!sortByCredit);
        return json(200, customers.map(c => c.toJSON()));
      }

      if (httpMethod === 'POST' && path?.endsWith('/customers')) {
        const body = this.readJson(event.body);
        const created = await this.createCustomer.execute({ name: body.name, email: body.email, phone: body.phone });
        return json(201, created.toJSON());
      }

      if (httpMethod === 'GET' && pathParameters?.id) {
        const customer = await this.getCustomer.execute(pathParameters.id);
        return json(200, customer.toJSON());
      }

      if (httpMethod === 'PUT' && pathParameters?.id) {
        const body = this.readJson(event.body);
        const updated = await this.updateCustomer.execute({ id: pathParameters.id, name: body.name, email: body.email, phone: body.phone });
        return json(200, updated.toJSON());
      }

      if (httpMethod === 'DELETE' && pathParameters?.id) {
        await this.deleteCustomer.execute(pathParameters.id);
        return noContent();
      }

      if (httpMethod === 'POST' && path?.includes('/add-credit') && pathParameters?.id) {
        const body = this.readJson(event.body);
        const updated = await this.addCredit.execute({ id: pathParameters.id, amount: Number(body.amount) });
        return json(200, updated.toJSON());
      }

      return json(404, { message: 'Route not found' });
    } catch (err) {
      return this.handleError(err);
    }
  }

  private readJson(body: string | null): any {
    if (!body) return {};
    try {
      return JSON.parse(body);
    } catch (e) {
      throw new ValidationError('Request body must be valid JSON');
    }
  }

  private readBooleanQuery(query: Record<string, string | undefined> | null | undefined, key: string): boolean {
    if (!query) return false;
    const v = query[key];
    return v === 'true' || v === '1' || v === 'yes';
  }

  private handleError(err: unknown): APIGatewayProxyResult {
    if (err instanceof ValidationError) return json(400, { message: err.message });
    if (err instanceof NotFoundError) return json(404, { message: err.message });
    if (err instanceof DomainError) return json(422, { message: err.message });
    console.error('Unhandled error', err);
    return json(500, { message: 'Internal Server Error' });
  }
}
