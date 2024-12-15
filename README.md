# Project Documentation

This README provides instructions on setting up and running the project using two different methods.

---

## Method 1: Local Setup

### Project Setup

Install project dependencies:

```bash
$ npm install
```

### Create Environment Variable

Copy the example environment variable file and configure it:

```bash
$ cp .env.example .env
```

### Compile and Run the Project

Run the application using one of the following modes:

```bash
# Development mode
$ npm run start

# Watch mode (auto-reloads on file changes)
$ npm run start:dev

# Production mode
$ npm run start:prod
```

---

## Method 2: Using Docker and Makefile

For Docker users, the project includes a `Makefile` to simplify API calls and container management.

### Prerequisites

Ensure the following are installed:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Commands Overview

#### Build and Start the Application

To build and start the Docker container:

```bash
$ make start
```

#### Stop the Application

To stop and remove the running Docker container:

```bash
$ make stop
```

---

### API Endpoints

The `Makefile` provides predefined commands to call specific API endpoints.

#### Base API URL

The base URL for the API is defined in the `Makefile`:

```text
http://localhost:5000/api
```

#### Supported Endpoints

- **Daily Uptime Statistics**: `/daily-uptime-statictis`
- **Daily Reward Statistics**: `/daily-reward-stats`
- **Delegation Statistics**: `/get-delegation-stats`

#### Call API Commands

To call an API endpoint, use one of the following commands:

- **Daily Uptime Statistics**:

  ```bash
  $ make call-daily-uptime
  ```

- **Daily Reward Statistics**:

  ```bash
  $ make call-daily-reward
  ```

- **Delegation Statistics**:
  ```bash
  $ make call-delegation-stats
  ```

---

## Makefile Commands

Here’s a summary of the `Makefile` commands:

| Command                      | Description                          |
| ---------------------------- | ------------------------------------ |
| `make build`                 | Build the Docker container           |
| `make start`                 | Build and start the application      |
| `make stop`                  | Stop and remove the Docker container |
| `make call-daily-uptime`     | Call the Daily Uptime Statistics API |
| `make call-daily-reward`     | Call the Daily Reward Statistics API |
| `make call-delegation-stats` | Call the Delegation Statistics API   |

---

## Notes

- Make sure the environment variables in `.env` are configured correctly before starting the project.
- The `Makefile` commands assume that the API endpoints are available on the base URL `http://localhost:5000/api`.

For further assistance, please refer to the project documentation or contact the development team.
