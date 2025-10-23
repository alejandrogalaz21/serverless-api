import { ICustomerRepository } from '../../domain/CustomerRepository';
import { Customer } from '../../domain/Customer';

/** Use case to list customers optionally sorted by available credit */
export class ListCustomers {
  constructor(private readonly repo: ICustomerRepository) {}

  /**
   * List all customers. If sortByCredit is true, sorts descending by availableCredit.
   */
  public async execute(sortByCredit = false): Promise<Customer[]> {
    const items = await this.repo.listAll();
    if (sortByCredit) {
      items.sort((a, b) => b.availableCredit - a.availableCredit);
    }
    return items;
  }
}
