const sha256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return sha256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}


class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(){
        return new Block(0, '01/03/2019', 'Genesis Block', '0');
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();

        this.chain.push(newBlock);
    }
}


let blkchain = new Blockchain();
blkchain.addBlock(new Block(1, '03/11/2019', {amount : 10}));
blkchain.addBlock(new Block(2, '03/12/2019', {amount : 20}));

console.log(JSON.stringify(blkchain, null, 4));