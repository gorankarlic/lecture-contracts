# Lecture Notes

## Prepare environment

### Clone repository

Clone this [git](https://git-scm.com) repository.

```sh
git clone https://github.com/gorankarlic/lecture-contracts.git ~/lecture-contracts
```

If you want to learn and play more with **git** you may want to try [GitKraken](https://www.gitkraken.com).

### Geth

Download and install [Geth](https://geth.ethereum.org/downloads/) in ```target/geth```

- On Rasperry Pi run

    ```
    cd ~/lecture-contracts
    npm run install-armv7
    ```

- On MacOS run

    ```sh
    cd ~/lecture-contracts
    npm run install-macos
    ```

## Run contract

### Run Proof of Authority (PoA) blockchain

Create a new Ethereum PoA blockchain using the genesis block specified in ```src/poa/genesis.json``` (it will recreate the folder```target/geth-data```). Run

```sh
cd ~/lecture-contracts
npm run blockchain-new
npm run blockchain-run
```

### Deploy and execute contract

Deploy and execute the smart contract.

```sh
cd ~/lecture-contracts
npm run contract
```