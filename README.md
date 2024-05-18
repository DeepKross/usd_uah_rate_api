# Project Name

## Introduction
This project is a TypeScript-based web application designed for managing subscription services for emails and USD/UAH exchange rate receiving. The application includes robust error handling, middleware validation, and a comprehensive test suite to ensure reliability and maintainability.

### Clean Architecture Overview
My project follows the principles of Clean Architecture to ensure a scalable, maintainable, and testable codebase. The core idea is to separate different layers of the application, ensuring that each layer has a clear responsibility. This separation helps in managing the complexity of the application and facilitates easier testing and maintenance.

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
- **Subscription Management**: Use the endpoints under `/subscribe` to manage subscriptions. Subscribed users receive emails. There is validation support, users can subscribe only once. `POST` request.
- **Exhange rate**: Interact with the exhange rate for USD/UAH `/rate`. You can also get any other currenct exhange rate by providing `from` and `to` via query params. `GET` request.

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

## Key feature and explanation

### Error handling
- Custom API error handling function was created that extended basic API with custom status and msg handling.
- **Catch Async** function was created so that we do not have to cover our controllers in `try - catch`. It helps to catch any error in the async function and send the corresponding error.

### Validation of requests
- `validate` and `pick` functions were created so we could using `Joi` schema define the rules to check the request params. That schemas can be covered with `validate` function and passed as middleware.

### DB
- We are using `PostgreSQL` with **Prisma ORM** as this ORM helps a lot by defining the right schema to DB, handling a lot of troubles with SQL with its build-in functionality.

### Mailer
- We are using `cron job` to handle every day msg receiving. I have left the comment on how to change cron to send msgs every day but left it to do it every minute for test purposes.
- **Important**. I have decided that it is better to run that cron as a separated process as a little microservice. We do not want our app to crush when the cron is crushed or the opposite. I hope you find this approach beneficial. 

### Docker
- run `docker compose up --build`. It will create everything needed to run the app. `Supervisord` will run 2 processes for the main app and cron job.

### Tests
- Covered all controllers using `jest` and `http-mocks` with unit tests. Pls run `test:unit`
- Convered all services
- Covered cron job with tests

## Contact
For any inquiries or feedback, please contact [volkermischa@gmail.com](mailto:volkermischa@gmail.com).
