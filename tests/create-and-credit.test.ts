import { InMemoryCustomerRepository } from '../src/infrastructure/repositories/InMemoryCustomerRepository';
import { CreateCustomer } from '../src/application/use-cases/CreateCustomer';
import { AddCredit } from '../src/application/use-cases/AddCredit';
import { GetCustomer } from '../src/application/use-cases/GetCustomer';

describe('Customer use cases', () => {
  it('creates a customer and adds credit', async () => {
    const repo = new InMemoryCustomerRepository();
    const create = new CreateCustomer(repo);
    const addCredit = new AddCredit(repo);
    const get = new GetCustomer(repo);

    const created = await create.execute({ name: 'Jane Rider', email: 'jane@example.com' });
    expect(created.toJSON().availableCredit).toBe(0);

    await addCredit.execute({ id: created.id, amount: 150 });

    const found = await get.execute(created.id);
    expect(found.toJSON().availableCredit).toBe(150);
  });
});
