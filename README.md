# Project Name

## Introduction
This project is a TypeScript-based web application designed for managing subscription services for emails and USD/UAH exchange rate receiving. The application includes robust error handling, middleware validation, and a comprehensive test suite to ensure reliability and maintainability.

## Features
- **Subscription Management**: Handle subscription processes.
- **Exhange rate**: Get current USD/UAH exchange rate or any other currencies.
- **Middleware Validation**: Validate requests using middleware.
- **Error Handling**: Centralized error handling mechanisms.
- **Unit Testing**: Comprehensive unit tests for controllers and services.

## Technology Stack
- **TypeScript**: For a strongly-typed, scalable codebase.
- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for Node.js.
- **Prisma**: ORM for database interactions.
- **Jest**: Testing framework.
- **Docker**: Containerization for development and deployment.

## Installation and Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/DeepKross/usd_uah_rate_api.git
   cd your-repo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup environment variables**:
   Create a `.env` file in the root directory and add the necessary environment variables. Refer to the `.env.example` file for the required variables.
   I know that all of that should not be exposed, but for testing purposes, I am revealing them in `env.example`.

5. **Run database migrations**:
   ```bash
   npx prisma migrate dev
   ```

6. **Start the application**:
   ```bash
   npm run dev
   ```
    ```bash
   npm run dev:mailer
   ```

7. **Run the tests**:
   ```bash
   npm run test:unit
   ```

## Usage
- **Health Check**: Access the health check endpoint at `/`.
- **Subscription Management**: Use the endpoints under `/subscribe` to manage subscriptions.
- **Rate Limiting**: Interact with the rate-limited endpoints under `/rate`.

## Project Structure
- **prisma**: Prisma schema and migration files.
- **src**: Source code directory.
  - **config**: Configuration files (config.ts, logger.ts, morgan.ts).
  - **controllers**: Controllers for handling requests (healthcheck.controller.ts, rate.controller.ts, subscribe.controller.ts).
  - **middlewares**: Middleware for request validation and error handling (validation, error.middleware.ts).
  - **models**: Type definitions for data models (rate.types.ts, subscribe.types.ts).
  - **public**: Publicly accessible files (favicon.ico).
  - **routes**: API routes (healthcheck.routes.ts, index.ts, rate.routes.ts, subscribe.routes.ts).
  - **services**: Business logic and service classes (healthcheck.service.ts, rate.service.ts, subscribe.service.ts, users.service.ts).
  - **subscriptionNotifier**: Subscription notification logic (mailer, subscriptionNotifier.ts).
  - **utils**: Utility functions (index.ts, prismaClient.ts).
- **tests**: Test files.
  - **fixtures**: Test fixtures (user.fixture.ts).
  - **unit**: Unit tests for controllers and services (controllers, cron, services).
- **compose.yaml**: Docker Compose configuration.
- **Dockerfile**: Docker build configuration.
- **jest.config.ts**: Jest configuration.

## Contact
For any inquiries or feedback, please contact [volkermischa@gmail.com](mailto:volkermischa@gmail.com).
