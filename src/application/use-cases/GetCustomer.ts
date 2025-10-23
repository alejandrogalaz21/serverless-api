import { ICustomerRepository } from '../../domain/CustomerRepository';
import { Customer } from '../../domain/Customer';
import { NotFoundError, ValidationError } from '../../domain/errors/DomainError';

/** Use case to get a customer by id. */
export class GetCustomer {
  constructor(private readonly repo: ICustomerRepository) {}

  /** Execute */
  public async execute(id: string): Promise<Customer> {
    if (!id || typeof id !== 'string') throw new ValidationError('id is required');
    const found = await this.repo.getById(id);
    if (!found) throw new NotFoundError(`Customer ${id} not found`);
    return found;
  }
}
