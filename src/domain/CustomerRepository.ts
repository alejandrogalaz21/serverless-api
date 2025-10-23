import { Customer, CustomerProps } from './Customer';

/**
 * Abstraction for customer persistence.
 */
export interface ICustomerRepository {
  /** Create a new customer */
  create(customer: Customer): Promise<void>;
  /** Get a customer by id */
  getById(id: string): Promise<Customer | null>;
  /** Update an existing customer */
  update(customer: Customer): Promise<void>;
  /** Delete a customer by id */
  delete(id: string): Promise<void>;
  /** List all customers */
  listAll(): Promise<Customer[]>;
}

/** Utility: hydrate a Customer from raw props */
export function hydrateCustomer(props: CustomerProps): Customer {
  return Customer.create(props);
}
