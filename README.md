# PevTK - Buy and Sell Pev Tokens with Ethereum

PevTK is a simple Web3 project that allows users to buy and sell a custom ERC-20 token (`PEVTK`) using Ethereum.  
It includes a smart contract backend (Solidity/Hardhat) and a React/Ethers.js frontend.

---

## Features
- Buy Pev Tokens with ETH
- Sell Pev Tokens for ETH
- Displays token price and user balance
- Owner can withdraw contract ETH
- Includes unit tests for the smart contract

---

## Project Structure

```
/contracts
  - PevTK.sol (ERC-20 smart contract)
/scripts
  - deploy.js (deployment script)
/test
  - PevTK.js (Hardhat tests)
/frontend
  /src
    - App.js (main React app)
    - contracts/getContracts.js
    - utils/connectWallet.js
    - utils/addresses.js
    - App.css (stylesheet)
```

---

## Smart Contract

- Token Name: Pev Token
- Token Symbol: PevTK
- Fixed Price: 0.002 ETH per token
- Built using OpenZeppelin's ERC20 and Ownable.

Smart contract events:
- PevTKBought(address buyer, uint256 amount)
- PevTKSold(address seller, uint256 amount)
- Withdrawal(address owner, uint256 amount)

---

## Frontend

- Built with React and Ethers.js
- Connects to MetaMask wallet
- Allows buying and selling Pev Tokens
- Displays token price and user balances
- Notification system for transaction feedback

---

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/your-username/PevTK.git
cd PevTK
```

### 2. Install dependencies

For backend (Hardhat):
```bash
npm install
```

For frontend:
```bash
cd frontend
npm install
```

### 3. Compile contracts
```bash
npx hardhat compile
```

### 4. Run tests
```bash
npx hardhat test
```

### 5. Deploy contract
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 6. Start frontend
```bash
cd frontend
npm start
```

---

## Requirements
- Node.js
- Hardhat
- MetaMask browser extension

---

## Notes
- Token price is fixed at deployment and cannot be changed.
- This project is for demo purposes only.
- Contract has not been audited for production use.

---

## License
This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgements
- OpenZeppelin Contracts: https://github.com/OpenZeppelin/openzeppelin-contracts
- Hardhat: https://hardhat.org/
- React: https://react.dev/
- Ethers.js: https://docs.ethers.org/