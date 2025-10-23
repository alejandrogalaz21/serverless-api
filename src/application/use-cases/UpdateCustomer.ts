import { ICustomerRepository } from '../../domain/CustomerRepository';
import { Customer } from '../../domain/Customer';
import { NotFoundError, ValidationError } from '../../domain/errors/DomainError';

/** Input to update a customer */
export interface UpdateCustomerInput {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
}

/** Use case to update customer details */
export class UpdateCustomer {
  constructor(private readonly repo: ICustomerRepository) {}

  public async execute(input: UpdateCustomerInput): Promise<Customer> {
    if (!input || !input.id) throw new ValidationError('id is required');
    const found = await this.repo.getById(input.id);
    if (!found) throw new NotFoundError(`Customer ${input.id} not found`);
    if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
      throw new ValidationError('Email is invalid');
    }
    found.update({ name: input.name, email: input.email, phone: input.phone });
    await this.repo.update(found);
    return found;
  }
}
