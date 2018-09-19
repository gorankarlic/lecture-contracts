"use strict";

const fs = require("fs");
const net = require("net");
const readline = require("readline");
const solc = require("solc");
const Web3 = require("web3");

function ask(question)
{
    return new Promise((resolve) =>
    {
        const stdio =
        {
            input: process.stdin,
            output: process.stdout
        };
        const rl = readline.createInterface(stdio);
        rl.question("Vote 'yes' or 'no'? ", (answer) =>
        {
            rl.close();
            resolve(answer);
        });
    });
}

async function askYesNo(question)
{
    while(true)
    {
        const answer = await ask(question);
        console.log(answer);
        switch(answer.toLowerCase())
        {
            case "no":
            {
                return false;
            }
            case "yes":
            {
                return true;
            }
        }
    }
}

const account = "0x77763ec12e5bc783a7ec0a8f0d11af7874292834";
const password = fs.readFileSync(`${__dirname}/geth/password.txt`, "utf8");
const solidity = fs.readFileSync(`${__dirname}/Voting.sol`, "utf8");
const sources =
{
    solidity: solidity
};
const compiled = solc.compile({sources: sources}, 1);
if(compiled.errors)
{
    console.log("failed to compile contract", compiled.errors[0]);
}
else
{
    const instance = compiled.contracts["solidity:Voting"];
    const abi = instance.interface;
    const bytecode = instance.bytecode;
    console.log("contract compiled");
    
    const web3 = new Web3(`${__dirname}/../target/geth-data/geth.ipc`, net);
    web3.eth.personal.unlockAccount(account, password, 60, (err, unlocked) =>
    {
        if(err)
        {
            console.log("failed to unlock account", err);
        }
        else if(unlocked)
        {
            console.log("Wallet unlocked", account);
            web3.eth.getBalance(account, (err, balance) =>
            {
                if(err)
                {
                    console.log("failed to get account balance", err);
                }
                else
                {
                    console.log("Account balance", balance);
                    const contract = new web3.eth.Contract(JSON.parse(abi));
                    const deploy = contract.deploy({data: "0x" + bytecode, arguments: []});
                    const opts =
                    {
                        from: account,
                        gas: 1000000,
                        gasPrice: 0
                    };
                    const send = deploy.send(opts);
                    send.on("error", (err) =>
                    {
                        console.log("failed to deploy contract", err);
                    });
                    send.on("receipt", async (receipt) =>
                    {
                        console.log("Received receipt", receipt);
                        const address = receipt.contractAddress;
                        console.log("Contract deployed at", address);
                        const answer = await askYesNo();
                        console.log(`Voting with ${answer}`);
                        const contract = new web3.eth.Contract(JSON.parse(abi), address);
                        const send = contract.methods.vote(answer).send({from: account});
                        send.on("transactionHash", (hash) =>
                        {
                            console.log("Received transaction hash", hash);
                        });
                        send.on("confirmation", (confirmationNumber, receipt) =>
                        {
                            console.log("Received confirmation", confirmationNumber);
                        });
                        send.on("receipt", (receipt) =>
                        {
                            console.log("Received receipt", receipt);
                            contract.methods.count().call((err, count) =>
                            {
                                console.log("Vote count", count);
                                process.exit(0);
                            });
                        });
                    });
                }
            });
        }
        else
        {
            console.log("can not unlock account");
        }
    });
}