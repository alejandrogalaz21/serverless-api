import { ICustomerRepository } from '../../domain/CustomerRepository';
import { NotFoundError, ValidationError } from '../../domain/errors/DomainError';

/** Use case to delete a customer by id */
export class DeleteCustomer {
  constructor(private readonly repo: ICustomerRepository) {}

  public async execute(id: string): Promise<void> {
    if (!id || typeof id !== 'string') throw new ValidationError('id is required');
    const found = await this.repo.getById(id);
    if (!found) throw new NotFoundError(`Customer ${id} not found`);
    await this.repo.delete(id);
  }
}
