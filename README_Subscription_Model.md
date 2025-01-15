# Subscription Model Documentation

This README provides instructions on how to set up and run Openpad Node in Subscription Model

NAAS Platforms (Node As A Service) deploy Node for users, users own this Node. Users activate and operate Node through UI of Platform.

Document Structure:

- [Hardware Requirement](#hardware-requirements)
- [Software Installation](#setup-nodejs)
- [NAAS Platform Integration](#node-deployment-integration)

## Hardware Requirements

### Minimum:

- CPU with 1+ cores
- 2GB RAM
- 4 MBit/sec download Internet service

### Recommended:

- Fast CPU with 2+ cores
- 4GB+ RAM
- 8+ MBit/sec download Internet service

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

#### API Endpoints

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
- **Get verifier address**: `/get-config`
- **Get verifier signature node enter**: `/get-verifier-signature-node-enter`
- **Get verifier signature node exit**: `/get-verifier-signature-node-exit`
- **Get my nfts**: `/get-my-nfts`

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
- **Undelegate /revoke**:

  ```bash
  $ make call-undelegate
  ```

- **Call get my nfts**:
  ```bash
  $ make call-my-nfts
  ```

### Makefile Commands

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
| `make call-undelegate`       | Call the Undelegate                         |
| `make call-my-nfts`          | Call my nfts                                |


### Notes

- Make sure the environment variables in `.env` are configured correctly before starting the project.
- The `Makefile` commands assume that the API endpoints are available on the base URL `http://localhost:5000/api`.

For further assistance, please refer to the project documentation or contact the development team.

## NAAS Platform Integration

For NAAS that provide Subcription Model, where users manually sign transaction to Blockhain Network on Platform UI.

- When launch, FE needs to post NFT Owner Address. Through that, BE call API end point **MY_NFT_ENDPOINT=/get-my-nfts** to get list of NFTs and Verifier Address according to each NFT Token ID.
- When start node, user select NFT to activate Node. FE use corresponding Verifier Address. Then, FE calls 2 functions on Smart Contract: delegate NFT to Verfier Address and activate node with that Verifier Address.
- For each user operation on the Node on onchain, it is necessary to use API endpoint **get-verifier-signature-node-enter** and **get-verifier-signature-node-exit** to retrieve the signature. Then, use these signatures to call the contract functions **nodeEnterWithSignature** and **nodeExitWithSignature**.

### Support interaction with Smart Contract (React)

For detailed instructions on start, stop, delegate and revoke delegate on verifier node with ReactJS, please see detail documentation in example folder.
