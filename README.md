# OtA
Decentralized Art Gallery where users can upload previews and links to art onto the Ethereum blockchain. Users can upvote each artwork and donate Ether to any submitter.  

### Installing Dependencies

From within the root directory:

```sh
npm install
```

## Development
To set up development environment: 
```sh
# Open up a new terminal to set up test blockchain with Ganache
npm run chain

# Compile the smart contracts
truffle compile

# Migrate the contract to the test blockchain
truffle migrate

#Start the application
npm start

```

Access the application at (http://localhost:3000)

Follow this [tutorial](https://truffleframework.com/docs/truffle/getting-started/truffle-with-metamask) to set up MetaMask that will connect your test blockchain to the app in the browser

## Built With
* [Truffle Suite](https://truffleframework.com/) - Used Truffle, Ganache, and Drizzle for development environment and front-end libraries

