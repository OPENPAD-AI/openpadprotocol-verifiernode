# Project Documentation

This README provides instructions on setting up and running the project using two different methods.

---

## Hardware Requirements

### Minimum:

- CPU with 1+ cores
- 2GB RAM
- 4 MBit/sec download Internet service

### Recommended:

- Fast CPU with 2+ cores
- 4GB+ RAM
- 8+ MBit/sec download Internet service

---

## Setup Node.js

### Install Node.js

Download and install Node.js from the [official website](https://nodejs.org/):

1. Go to [https://nodejs.org/](https://nodejs.org/).
2. Download the LTS (Long-Term Support) version for your operating system.
3. Follow the installation instructions provided for your platform.

### Install Node.js v21 or Higher

For the latest version (v21 or higher), use the following steps:

1. Install `nvm` (Node Version Manager) to manage Node.js versions:

   ```bash
   $ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
   ```

2. Restart your terminal or load `nvm`:

   ```bash
   $ source ~/.nvm/nvm.sh
   ```

3. Install Node.js v21:

   ```bash
   $ nvm install 21
   ```

4. Use Node.js v21:

   ```bash
   $ nvm use 21
   ```

5. Verify the installed version:

   ```bash
   $ node -v
   ```

### Verify Installation

After installation, verify that Node.js and npm (Node Package Manager) are installed correctly:

```bash
$ node -v
$ npm -v
```

These commands should output the installed versions of Node.js and npm.

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
# change environment
# PRIVATE_KEY=
# CLAIMER_ADDRESS=
# COMMISSION_RATE=
$ cp .env.example .env
```

### Compile and Run the Project

Run the application using one of the following modes:

```bash
# build source
$ npm run build

# Production mode
$ PRIVATE_KEY= CLAIMER_ADDRESS= COMMISSION_RATE=10 npm run start:prod
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
- **Node list with info delegate**: `/get-node-list`

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
- **Node Enter**:

  ```bash
  $ make call-node-enter
  ```

- **Node Exit**:
  ```bash
  $ make call-node-exit
  ```
- **Node List**:
  ```bash
  $ make call-node-list
  ```

---

## Makefile Commands

Here’s a summary of the `Makefile` commands:

| Command                      | Description                                 |
| ---------------------------- | ------------------------------------------- |
| `make build`                 | Build the Docker container                  |
| `make start`                 | Build and start the application             |
| `make stop`                  | Stop and remove the Docker container        |
| `make call-daily-uptime`     | Call the Daily Uptime Statistics API        |
| `make call-daily-reward`     | Call the Daily Reward Statistics API        |
| `make call-delegation-stats` | Call the Delegation Statistics API          |
| `make call-node-exit`        | Call the Node Exit API                      |
| `make call-node-enter`       | Call the Node Enter API                     |
| `make call-node-list`        | Call the Node list with number delegate API |

---

## Notes

- Make sure the environment variables in `.env` are configured correctly before starting the project.
- The `Makefile` commands assume that the API endpoints are available on the base URL `http://localhost:5000/api`.

For further assistance, please refer to the project documentation or contact the development team.
