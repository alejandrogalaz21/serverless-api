/**
 * Customer entity representing a shopper in the online motorbike store.
 */
export interface CustomerProps {
  /** Unique identifier */
  id: string;
  /** Customer full name */
  name: string;
  /** Contact email */
  email: string;
  /** Optional phone number */
  phone?: string;
  /** Available store credit in currency units */
  availableCredit: number;
  /** ISO timestamp when created */
  createdAt: string;
  /** ISO timestamp when last updated */
  updatedAt: string;
}

/**
 * Customer aggregate with basic invariants and behaviors.
 */
export class Customer {
  private props: CustomerProps;

  private constructor(props: CustomerProps) {
    this.props = props;
  }

  /** Factory method to create a new Customer */
  public static create(props: CustomerProps): Customer {
    return new Customer({ ...props });
  }

  /** Get raw props snapshot (immutable copy) */
  public toJSON(): CustomerProps {
    return { ...this.props };
  }

  /** Unique identifier */
  public get id(): string {
    return this.props.id;
  }

  /** Available credit */
  public get availableCredit(): number {
    return this.props.availableCredit;
  }

  /** Update mutable fields */
  public update(data: Partial<Pick<CustomerProps, 'name' | 'email' | 'phone'>>): void {
    if (typeof data.name === 'string') this.props.name = data.name;
    if (typeof data.email === 'string') this.props.email = data.email;
    if (typeof data.phone === 'string' || data.phone === undefined) this.props.phone = data.phone;
    this.touch();
  }

  /** Add positive credit to the customer */
  public addCredit(amount: number): void {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Credit amount must be a positive number.');
    }
    this.props.availableCredit = round2(this.props.availableCredit + amount);
    this.touch();
  }

  /** Internal: update updatedAt */
  private touch(): void {
    this.props.updatedAt = new Date().toISOString();
  }
}

/** Round to 2 decimals to avoid float drifts */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
