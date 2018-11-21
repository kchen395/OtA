import TopArt from './../build/contracts/TopArt.json'

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:8545'
    }
  },
  contracts: [
		TopArt
  ],
  events: {
		TopArt: ['StorageSet']
  },
  polls: {
    accounts: 1500
  }
}

export default drizzleOptions