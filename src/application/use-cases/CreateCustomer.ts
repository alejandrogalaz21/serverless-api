import { ICustomerRepository } from '../../domain/CustomerRepository';
import { Customer } from '../../domain/Customer';
import { ValidationError } from '../../domain/errors/DomainError';
import { randomUUID } from 'crypto';

/**
 * Input payload to create a customer.
 */
export interface CreateCustomerInput {
  name: string;
  email: string;
  phone?: string;
}

/**
 * Use case to create a new customer.
 */
export class CreateCustomer {
  constructor(private readonly repo: ICustomerRepository) {}

  /** Execute the use case */
  public async execute(input: CreateCustomerInput): Promise<Customer> {
    validate(input);
    const now = new Date().toISOString();
    const customer = Customer.create({
      id: randomUUID(),
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone?.trim(),
      availableCredit: 0,
      createdAt: now,
      updatedAt: now,
    });
    await this.repo.create(customer);
    return customer;
  }
}

function validate(input: CreateCustomerInput): void {
  if (!input || typeof input.name !== 'string' || !input.name.trim()) {
    throw new ValidationError('Name is required.');
  }
  if (!input || typeof input.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    throw new ValidationError('Valid email is required.');
  }
}
