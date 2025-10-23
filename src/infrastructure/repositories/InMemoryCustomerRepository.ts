import { ICustomerRepository } from '../../domain/CustomerRepository';
import { Customer } from '../../domain/Customer';

/** Simple in-memory repository for tests */
export class InMemoryCustomerRepository implements ICustomerRepository {
  private store = new Map<string, Customer>();

  async create(customer: Customer): Promise<void> {
    this.store.set(customer.id, customer);
  }
  async getById(id: string): Promise<Customer | null> {
    return this.store.get(id) ?? null;
  }
  async update(customer: Customer): Promise<void> {
    this.store.set(customer.id, customer);
  }
  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
  async listAll(): Promise<Customer[]> {
    return [...this.store.values()].map(c => c);
  }
}
