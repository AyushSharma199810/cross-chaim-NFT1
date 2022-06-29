const Web3 = require("web3");
const ethtoken = require("../build/contracts/TokenEth.json");
const bsctoken = require("../build/contracts/TokenBsc.json");
const ethbridge = require('../build/contracts/BridgeEth.json');
const Sendmoney = require("./SendMoney");
const web3eth = new Web3("https://rinkeby.infura.io/v3/7225d4d9beaa4b5896b367a3c755b15c");
const web3bsc = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");
const ethContract = new web3eth.eth.Contract(ethtoken.abi,ethtoken.networks[4].address);
const bscContract = new web3bsc.eth.Contract(bsctoken.abi,bsctoken.networks[97].address);
const ethBridge = new web3eth.eth.Contract(ethbridge.abi,ethbridge.networks[4].address);
const SendMoney  = require("../build/contracts/SendMoney.json");
const MoneyContract = new web3eth.eth.Contract(SendMoney.abi,SendMoney.networks[4].address);


var amountToBeTransfered;

const ReceiveAndMint =  async (req,res) => {
    //   const [recipient, _] = await web3.eth.getAccounts();
    const address = req.body.add;
    const privatekey1 = req.body.privatekey;
    // console.log(privatekey1)
    // const add = "0x0a1b05De4569F7728244728259E43BDF277461b7";
    const recieve = await MoneyContract.methods.receiveMoney();
    const contractAddress1 = SendMoney.networks[4].address;
    const value1 = req.body.value;
    if(value1 < 5){
      console.log("Amount too low");

    }
    else{
  // const privatekey = "fc92fef1130ce4e041b39bfaea9053e66cfa4f34462ebfd49ed9a6863032b8ac";
    // const privatekey1 =  "78fb70faef99da7ca0f55b32392f566d936a978336fd2969b08998c50cb33277";
    const recieveABI = recieve.encodeABI();

  const gasPrice1 = await web3eth.eth.getGasPrice();
  const nonce1 = await web3eth.eth.getTransactionCount(address,"pending");
  NetworkID = 4;
  const rawtx1 = {
    from: address,
    to: contractAddress1 ,
    data: recieveABI,
    value: web3eth.utils.toHex(value1),
    gas: web3eth.utils.toHex(1500000),
    gasPrice1,
    nonce1,
   }
   const sign1 = await web3eth.eth.accounts.signTransaction(rawtx1,privatekey1);
   const receipt1 = await web3eth.eth.sendSignedTransaction(sign1.rawTransaction);
//    console.log(receipt.transactionHash);
//    res.send(receipt);
   const result = (await MoneyContract.getPastEvents("balance",{fromBlock: 'latest'}));
   const result1 = result[0].returnValues.balance;
  //  res.send(result);
    const add = "0x0a1b05De4569F7728244728259E43BDF277461b7";
    const contractAddress = ethtoken.networks[4].address;
  
  const privatekey = "fc92fef1130ce4e041b39bfaea9053e66cfa4f34462ebfd49ed9a6863032b8ac";
  const mint1 = await ethContract.methods.mint(add, result1 * 10);
  const burnABI = mint1.encodeABI();

  const gasPrice = await web3eth.eth.getGasPrice();
  const nonce = await web3eth.eth.getTransactionCount(add,"pending");
  NetworkID = 4;
  const rawtx = {
    from: add,
    to: contractAddress ,
    data: burnABI,
    gas: web3eth.utils.toHex(1500000),
    gasPrice,
    nonce,
   }
   const sign = await web3eth.eth.accounts.signTransaction(rawtx,privatekey);
   const receipt = await web3eth.eth.sendSignedTransaction(sign.rawTransaction);
  //  console.log(receipt.transactionHash);
  //  console.log(receipt);
   const _result = (await ethContract.getPastEvents("Transfer",{fromBlock: 'latest'}));
   const _result1 = _result[0].returnValues.amount;
  //  console.log(_result1)
  //  console.log(_result1);
  res.send(`${result1}eth => ${_result1}MTK`);
amountToBeTransfered = _result1;
console.log(amountToBeTransfered);

  }
}
const transfer =  async (req,res) => {
  // console.log(amountToBeTransfered);
  // const [recipient, _] = await Web3.eth.getAccounts();
  const add = "0x0a1b05De4569F7728244728259E43BDF277461b7";
  const contractAddress = ethtoken.networks[4].address;
  
  // const privatekey = req.body.privatekey;
  // console.log(amountToBeTransfered);
  const privatekey = "fc92fef1130ce4e041b39bfaea9053e66cfa4f34462ebfd49ed9a6863032b8ac";
  const burn1 = await ethContract.methods.burn(add,amountToBeTransfered);
  const burnABI = burn1.encodeABI();
  // console.log(add,contractAddress,privatekey);

  const gasPrice = await web3eth.eth.getGasPrice();
  const nonce = await web3eth.eth.getTransactionCount(add,"pending");
  NetworkID = 4;
  const rawtx = {
    from: add,
    to: contractAddress ,
    data: burnABI,
    gas: web3eth.utils.toHex(1500000),
    gasPrice,
    nonce,
   }
  const sign = await web3eth.eth.accounts.signTransaction(rawtx,privatekey);
  const receipt = await web3eth.eth.sendSignedTransaction(sign.rawTransaction);
  const ethtokenburn = await receipt.status;
  const result = (await ethContract.getPastEvents("Transfer",{fromBlock: 'latest'}));
  const result1 = result[0].returnValues.amount;
  console.log(result1);
//    res.send(receipt);
if(ethtokenburn == true){
    const mint1 = await bscContract.methods.mint(add,amountToBeTransfered);
    const mintABI = mint1.encodeABI();
    const ContractAddressBsc = bsctoken.networks[97].address;
    const gasPricebsc = await web3bsc.eth.getGasPrice();
    const noncebsc = await web3bsc.eth.getTransactionCount(add,"pending");
    NetworkID = 97;
    const rawtxbsc = {
      from: add,
      to: ContractAddressBsc ,
      data: mintABI,
      gas: web3bsc.utils.toHex(1500000),
      gasPricebsc,
      noncebsc,
     }
     const signbsc = await web3bsc.eth.accounts.signTransaction(rawtxbsc,privatekey);
     const receiptbsc = await web3bsc.eth.sendSignedTransaction(signbsc.rawTransaction);
    //  console.log(receiptbsc.transactionHash);
     if(receipt.status == true){     
     rawtx.transferstatus = "Transfer has been done successfully";
     res.send(rawtxbsc);
     
    
    }   else{
        res.send("invalid request");
    }
}
else {
    console.log("invalid request");
    res.send(Error);

}}
const BalanceBsc = async(req,res) => {
    const add = "0x0a1b05De4569F7728244728259E43BDF277461b7";
    const balance1 = await bscContract.methods.balanceOf(add).call();
    res.send(balance1);

  // console.log(`transaction hash:${receipt.transactionHash}`);
  // const Rinkbridge = await RinkBridge.deployed();
  // // // await Rinkbridge.burn(add , 1, 2);
  // console.log(Rinkbridge.events.Transfer());
  // const Rinkbridge = await RinkBridge.deployed();
    // console.log(Rinkbridge);
    // await Rinkbridge.burn(add , 1 ,  2, "0*00");
  
  // res.send(bridge);
  }
  const BalanceEth = async(req,res) => {
    const add = "0x0a1b05De4569F7728244728259E43BDF277461b7";
    const balance1 = await ethContract.methods.balanceOf(add).call();
    res.send(balance1);
  }
  const mintbsc = async(req,res)=> {
    const add = "0x0a1b05De4569F7728244728259E43BDF277461b7";
    const mint1 = await bscContract.methods.mint(add,10);
    const mintABI = mint1.encodeABI();
    const ContractAddressBsc = bsctoken.networks[97].address;
    const privatekey = "fc92fef1130ce4e041b39bfaea9053e66cfa4f34462ebfd49ed9a6863032b8ac";
  
    const gasPrice = await web3bsc.eth.getGasPrice();
    const nonce = await web3bsc.eth.getTransactionCount(add,"pending");
    NetworkID = 97;
    const rawtx = {
      from: add,
      to: ContractAddressBsc ,
      data: mintABI,
      gas: web3bsc.utils.toHex(1500000),
      gasPrice,
      nonce,
     }
     const sign = await web3bsc.eth.accounts.signTransaction(rawtx,privatekey);
     const receipt = await web3bsc.eth.sendSignedTransaction(sign.rawTransaction);
     console.log(receipt.transactionHash);
     res.send(receipt);
}
const events = async (req,res)=> {
  const transfer = await ethBridge.events.Transfer({filter: {address: "0x0a1b05De4569F7728244728259E43BDF277461b7"},     fromBlock: 0,
  toBlock: 'latest'
});
  console.log(transfer);
}
const burn = async(req,res)=> {
  const add = "0x0a1b05De4569F7728244728259E43BDF277461b7";
  const burn1 = await ethBridge.methods.burn("0x0a1b05De4569F7728244728259E43BDF277461b7", 10);
  const burnABI = burn1.encodeABI();
  const contractAddress = ethbridge.networks[4].address;
  const privatekey = "fc92fef1130ce4e041b39bfaea9053e66cfa4f34462ebfd49ed9a6863032b8ac";
  const gasPrice = await web3eth.eth.getGasPrice();
  const nonce1 = await web3eth.eth.getTransactionCount(add,"pending");
  NetworkID = 4;
  const rawtx = {
    from: add,
    to: contractAddress ,
    data: burnABI,
    gas: web3eth.utils.toHex(1500000),
    gasPrice,
    nonce1,
   }
   const sign = await web3eth.eth.accounts.signTransaction(rawtx,privatekey);
   const receipt = await web3eth.eth.sendSignedTransaction(sign.rawTransaction);
  res.send(receipt);

  const result = (await ethBridge.getPastEvents("Transfer",{fromBlock: 'latest'}));
  const result1 = result[0].returnValues;
  res.send(result1)
  const {from,to,amount,date,nonce,step} = result1;
  console.log(from,to,amount,date,nonce,step);

  

}
module.exports = { transfer,ReceiveAndMint, BalanceBsc ,mintbsc,BalanceEth,events,burn};
