# Electronic Health Records (EHR) System using Blockchain

## Prerequisites

Before starting, ensure you have the following installed on your system:

- Node.js and npm 
- Truffle 
- Ganache 
- Metamask browser extension

## Installation

1. **Clone the Repository**: 
    ```bash
    git clone <repository_url>
    ```

2. **Navigate to the Project Directory**:
    ```bash
    cd ehr
    ```

3. **Install Dependencies**:
    ```bash
    cd contracts
    npm install
    cd ../client
    npm install
    ```

4. **Compile and Migrate Smart Contracts**:
    ```bash
    cd ../contracts
    truffle migrate
    ```

5. **Run the Client Application**:
    ```bash
    cd ../client
    npm start
    ```

6. **Connect Metamask**:
    - Ensure Metamask extension is installed in your browser.
    - Connect Metamask to the local blockchain network (Ganache).
    - Import one of the Ganache accounts into Metamask.

## Usage

Once the setup is complete and the client application is running:

- Open your browser and navigate to `http://localhost:3000`.
- Use the application to interact with the EHR system.
- You can create patient records, view existing records, update patient information, etc.

## Troubleshooting

If you encounter issues with smart contract migration, try running:
```bash
truffle migrate --reset
```
- Ensure Ganache is running before deploying the smart contracts.
  
If the client application fails to start, try reinstalling dependencies:
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```
