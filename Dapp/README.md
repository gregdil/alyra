# Dapp Voting

http://www-bonsplans-deco-com-dev-website.s3-website.eu-west-3.amazonaws.com/

## Video

https://www.loom.com/share/f84856b74e004e8685a1a5ec75876078

## Url de la Dapp

La Dapp est deployé sur un serveur S3 : 


# Deploiement Truffle Contract
```sh
  truffle migrate --reset --network ropsten 
```

# React Truffle Box

This box comes with everything you need to start using Truffle to write, compile, test, and deploy smart contracts, and interact with them from a React app.

## Installation

First ensure you are in an empty directory.

Run the `unbox` command using 1 of 2 ways.

```sh
# Install Truffle globally and run `truffle unbox`
$ npm install -g truffle
$ truffle unbox react
```

```sh
# Alternatively, run `truffle unbox` via npx
$ npx truffle unbox react
```

Start the react dev server.

```sh
$ cd client
$ npm start
  Starting the development server...
```

From there, follow the instructions on the hosted React app. It will walk you through using Truffle and Ganache to deploy the `SimpleStorage` contract, making calls to it, and sending transactions to change the contract's state.


