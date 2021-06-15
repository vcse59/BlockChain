const sha256 = require('crypto-js/sha256');


class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}
class Block{
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return sha256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) != Array(difficulty+1).join('0')){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined : " + this.hash);
    }
}


class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block(0, '01/03/2019', 'Genesis Block', '0');
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions); 
        // Incase of Bitcoin, block size cannot exceed 1MB
        // Miners can choose what transcation need to include in block
        block.mineBlock(this.difficulty);
        console.log("Block successfully mined");

        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransactions(transcation){
        this.pendingTransactions.push(transcation);
    }

    getBalanceOfAddress(address)
    {
        let balance = 0;
        for (const block of this.chain)
        {
            for(const transaction of block.transactions)
            {
                if (address == transaction.fromAddress)
                {
                    balance -= transaction.amount;
                }

                if (address == transaction.toAddress)
                {
                    balance += transaction.amount;
                }
            }
        }

        return balance;
    }

    isChainValid(){
        for (let i = 1; i < this.chain.length; i++)
        {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash != currentBlock.calculateHash())
            {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash)
            {
                return false;
            }
        }

        return true;
    }
}


let blkchain = new Blockchain();
blkchain.createTransactions(new Transaction('addr1', 'addr2', 100));
blkchain.createTransactions(new Transaction('addr2', 'addr1', 50));

console.log("Starting the miner...");
blkchain.minePendingTransactions('miner-address');

console.log("Balance of miner-address : " + blkchain.getBalanceOfAddress('miner-address'));

console.log("Starting the miner...");
blkchain.minePendingTransactions('miner-address');

console.log("Balance of miner-address : " + blkchain.getBalanceOfAddress('miner-address'));
