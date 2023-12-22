## Simple Rock Paper Scissors Dapp built on Soroban using React + Freighter API

[Live Demo](https://rps-dapp-d0p341xgx-rohitverma007.vercel.app/)

### Prerequisites

Make sure you have Rust + Soroban setup done as per the page here: https://soroban.stellar.org/docs/getting-started/setup

### Building and running the dApp

1. Clone the repo

    `git clone https://github.com/rohitverma007/rps-dapp.git`

2. Change directory to the frontend (React app)

    `cd rps-dapp/rps-frontend`

3. Install dependencies

    `npm install`

4. Run the app

    `npm start`

5. Open the app in browser

    `http://localhost:3000`

### Building and deploying the contract (on testnet)

Within the main directory, run the following command to build the contract

`soroban contract build`

The above command will create a `target` directory with the compiled contract. Now we can deploy the contract to the network using the following command (Assuming you have an alice identity created as per soroban set up):

```
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/rps_contract.wasm \
  --source alice \
  --network testnet
```

The above command will return a contract address. Use the contract address to deploy the typescript bindings that are used by the frontend app:

```
soroban contract bindings typescript \
 --network testnet \
 --contract-id CONTRACT_ID_FROM_ABOVE_COMMAND \
 --output-dir rps_frontend/node_modules/rps_contract-client
```

To publish the typescript bindings, change directory to its location and publish it to npm:

```
cd rps_frontend/node_modules/rps_contract-client
npm publish
```
