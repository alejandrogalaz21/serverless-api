/**
 * Base class for domain-specific errors.
 */
export class DomainError extends Error {
  /** Error name */
  public readonly name: string = 'DomainError';

  /** Optional error details for debugging */
  public readonly details?: unknown;

  constructor(message: string, details?: unknown) {
    super(message);
    this.details = details;
  }
}

/**
 * Error thrown when an entity is not found.
 */
export class NotFoundError extends DomainError {
  public readonly name = 'NotFoundError';
}

/**
 * Error thrown when input validation fails.
 */
export class ValidationError extends DomainError {
  public readonly name = 'ValidationError';
}
