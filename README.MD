# TaxDown Customer API

This is a REST API for customer management in an online motorcycle shop, built with Node.js, TypeScript, and Serverless Framework. It supports CRUD operations for customers, adding available credit, and listing customers sorted by credit. The project follows best practices like SOLID principles, Domain-Driven Design (DDD), and Hexagonal Architecture for maintainability, testability, and scalability.

## Architecture Overview

The API is structured using **Hexagonal Architecture** (also known as Ports and Adapters), which separates business logic from external concerns like databases and frameworks. This ensures the core domain is independent and easy to test or modify.

### Key Principles and Layers
- **SOLID Principles**: Applied throughout for clean, modular code.
  - **Single Responsibility**: Each class has one job (e.g., `CustomerService` handles validation and credit logic).
  - **Open-Closed**: Code is extensible without modification (e.g., repositories can be swapped).
  - **Liskov Substitution**: Interfaces ensure interchangeable implementations.
  - **Interface Segregation**: Small, focused interfaces (e.g., `ICustomerRepository`).
  - **Dependency Inversion**: High-level modules depend on abstractions, not concretions.

- **Domain-Driven Design (DDD)**: Focuses on the business domain.
  - **Entities**: Core business objects (e.g., `Customer` with attributes like `id`, `name`, `email`, `availableCredit`).
  - **Services**: Pure business logic (e.g., `CustomerService` for validation and credit addition).
  - No external dependencies in this layer.

- **Hexagonal Architecture Layers**:
  - **Domain Layer** (`src/domain/`): Contains entities and services. This is the core business logic, independent of frameworks or databases.
  - **Application Layer** (`src/application/useCases/`): Contains use cases that orchestrate domain logic (e.g., `CreateCustomer`, `ListCustomers`). Acts as the application's entry point for business operations.
  - **Infrastructure Layer** (`src/infrastructure/`): Handles external concerns like databases (e.g., `DynamoCustomerRepository`), controllers (e.g., `CustomerController` for HTTP handling), and configurations. Adapters connect to the outside world (e.g., DynamoDB, API Gateway).

- **Additional Practices**:
  - **Dependency Injection**: Use cases and controllers receive dependencies (e.g., repositories) via constructors for testability.
  - **Error Handling**: Centralized in controllers with appropriate HTTP status codes.
  - **Testing**: Unit tests for domain logic; integration tests for endpoints.
  - **Serverless**: Uses AWS Lambda, API Gateway, and DynamoDB for scalability. Local development with `serverless-offline`.

### Project Structure
```
taxdown-customer-api/
├── src/
│   ├── domain/            # Business logic (entities, services)
│   ├── application/       # Use cases (application logic)
│   ├── infrastructure/    # Adapters (repositories, controllers)
│   └── index.ts           # Lambda handler
├── tests/                 # Unit and integration tests
├── serverless.yml         # Serverless configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript config
├── jest.config.js        # Testing config
└── README.md              # This file
```

## Requirements
- Node.js 18+ (tested with v20.19.0)
- npm 8+ (tested with 10.8.2)
- AWS CLI configured (for deployment)
- Serverless Framework 4+ (installed globally or locally)

## Installation
1. Clone or download the project: