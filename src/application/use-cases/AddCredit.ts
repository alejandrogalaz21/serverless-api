import { ICustomerRepository } from '../../domain/CustomerRepository';
import { Customer } from '../../domain/Customer';
import { NotFoundError, ValidationError } from '../../domain/errors/DomainError';

/** Input payload to add credit */
export interface AddCreditInput {
  id: string;
  amount: number;
}

/** Use case to add available credit to a customer */
export class AddCredit {
  constructor(private readonly repo: ICustomerRepository) {}

  public async execute(input: AddCreditInput): Promise<Customer> {
    if (!input || typeof input.id !== 'string') throw new ValidationError('id is required');
    if (!Number.isFinite(input.amount) || input.amount <= 0)
      throw new ValidationError('amount must be a positive number');
    const found = await this.repo.getById(input.id);
    if (!found) throw new NotFoundError(`Customer ${input.id} not found`);
    found.addCredit(input.amount);
    await this.repo.update(found);
    return found;
  }
}
