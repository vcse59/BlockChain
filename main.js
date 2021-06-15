const { Blockchain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


const myKey = ec.keyFromPrivate('0990fe04207a85be9366980df920193b053a4608f70aad76dda6cd22633f16a5');
const myWalletAddress = myKey.getPublic('hex');

let blkchain = new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
blkchain.addTransactions(tx1);

console.log("Starting the miner...");
blkchain.minePendingTransactions(myWalletAddress);

console.log("Balance of miner-address : " + blkchain.getBalanceOfAddress(myWalletAddress));
blkchain.chain[1].transactions[0].amount = 1;
console.log('Is Chain Valid : ' + blkchain.isChainValid());