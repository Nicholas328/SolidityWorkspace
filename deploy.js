/**
 * synchronous [solidity] 同步
 * asynchronous [javascript] 异步
 */

// 引入库，全局使用
const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  // 本地 Ganache 虚拟区块链
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  //通过私钥Json生成钱包
  // const encryptedJson = fs.readFileSync("./.encryptedKey.json");
  // let wallet = ethers.Wallet.fromEncryptedJsonSync(
  //   encryptedJson,
  //   process.env.PRIVATE_KEY_PASSWORD
  // );
  // wallet = await wallet.connect(provider);//链接钱包到区块链

  // 链接钱包
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // 读取合约 ABI
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  // 读取合约二进制文件
  const bin = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8");

  // 合约工厂类
  console.log("Deploying contract, please wait...");
  const contractFactory = new ethers.ContractFactory(abi, bin, wallet);

  /**
   * 部署合约
   * deploymentTransaction是部署合约的应答
   * deploymentReceipt是等待区块确立后才会返回
   */
  // console.log("------------Deployment Transaction------------");
  const contract = await contractFactory.deploy();
  // console.log(contract.deploymentTransaction());
  console.log("Contract address: " + (await contract.getAddress()).toString());

  // console.log("------------Deployment Receipt------------");
  const deploymentReceipt = await contract.deploymentTransaction().wait(1);
  // console.log(deploymentReceipt);

  //Get num
  let getFavNum = await contract.getNum();
  console.log("Current Fav Num: " + getFavNum.toString());

  const transRsp = await contract.storeNum("7");
  const transRectipt = await transRsp.wait(1);
  const updateFavNum = await contract.getNum();
  console.log("Current Fav Num: " + updateFavNum.toString());

  // Deploy with only transaction data
  // const nonce = await wallet.getNonce();
  // const tx = {
  //   nonce: nonce,
  //   gasPrice: 20000000000,
  //   gasLimit: 1000000,
  //   to: null,
  //   value: 0,
  //   data: "0x608060405260016000806101000a81548160ff0219169083151502179055507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9c600060016101000a81548160ff021916908360000b60ff1602179055506040518060400160405280600381526020017f74656e0000000000000000000000000000000000000000000000000000000000815250600190805190602001906100a79291906101a9565b5073d0c47728dc490a4485709ca76f12d23cf842aa87600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507f63617400000000000000000000000000000000000000000000000000000000006003556040518060400160405280600281526020016040518060400160405280600481526020017f6e69636b0000000000000000000000000000000000000000000000000000000081525081525060056000820151816000015560208201518160010190805190602001906101949291906101a9565b5050503480156101a357600080fd5b506102ad565b8280546101b59061024c565b90600052602060002090601f0160209004810192826101d7576000855561021e565b82601f106101f057805160ff191683800117855561021e565b8280016001018555821561021e579182015b8281111561021d578251825591602001919060010190610202565b5b50905061022b919061022f565b5090565b5b80821115610248576000816000905550600101610230565b5090565b6000600282049050600182168061026457607f821691505b602082108114156102785761027761027e565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b610772806102bc6000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c806367e0badb1461005c5780636f760f411461007a57806392fa9da3146100965780639a67c8b1146100c6578063a4e1ca5a146100e2575b600080fd5b610064610113565b604051610071919061052b565b60405180910390f35b610094600480360381019061008f9190610412565b61011d565b005b6100b060048036038101906100ab91906103c9565b6101ad565b6040516100bd919061052b565b60405180910390f35b6100e060048036038101906100db919061046e565b6101db565b005b6100fc60048036038101906100f7919061046e565b6101e5565b60405161010a929190610546565b60405180910390f35b6000600454905090565b600860405180604001604052808381526020018481525090806001815401808255809150506001900390600052602060002090600202016000909190919091506000820151816000015560208201518160010190805190602001906101839291906102a1565b505050806009836040516101979190610514565b9081526020016040518091039020819055505050565b6009818051602081018201805184825260208301602085012081835280955050505050506000915090505481565b8060048190555050565b600881815481106101f557600080fd5b906000526020600020906002020160009150905080600001549080600101805461021e9061063f565b80601f016020809104026020016040519081016040528092919081815260200182805461024a9061063f565b80156102975780601f1061026c57610100808354040283529160200191610297565b820191906000526020600020905b81548152906001019060200180831161027a57829003601f168201915b5050505050905082565b8280546102ad9061063f565b90600052602060002090601f0160209004810192826102cf5760008555610316565b82601f106102e857805160ff1916838001178555610316565b82800160010185558215610316579182015b828111156103155782518255916020019190600101906102fa565b5b5090506103239190610327565b5090565b5b80821115610340576000816000905550600101610328565b5090565b60006103576103528461059b565b610576565b90508281526020810184848401111561037357610372610705565b5b61037e8482856105fd565b509392505050565b600082601f83011261039b5761039a610700565b5b81356103ab848260208601610344565b91505092915050565b6000813590506103c381610725565b92915050565b6000602082840312156103df576103de61070f565b5b600082013567ffffffffffffffff8111156103fd576103fc61070a565b5b61040984828501610386565b91505092915050565b600080604083850312156104295761042861070f565b5b600083013567ffffffffffffffff8111156104475761044661070a565b5b61045385828601610386565b9250506020610464858286016103b4565b9150509250929050565b6000602082840312156104845761048361070f565b5b6000610492848285016103b4565b91505092915050565b60006104a6826105cc565b6104b081856105d7565b93506104c081856020860161060c565b6104c981610714565b840191505092915050565b60006104df826105cc565b6104e981856105e8565b93506104f981856020860161060c565b80840191505092915050565b61050e816105f3565b82525050565b600061052082846104d4565b915081905092915050565b60006020820190506105406000830184610505565b92915050565b600060408201905061055b6000830185610505565b818103602083015261056d818461049b565b90509392505050565b6000610580610591565b905061058c8282610671565b919050565b6000604051905090565b600067ffffffffffffffff8211156105b6576105b56106d1565b5b6105bf82610714565b9050602081019050919050565b600081519050919050565b600082825260208201905092915050565b600081905092915050565b6000819050919050565b82818337600083830152505050565b60005b8381101561062a57808201518184015260208101905061060f565b83811115610639576000848401525b50505050565b6000600282049050600182168061065757607f821691505b6020821081141561066b5761066a6106a2565b5b50919050565b61067a82610714565b810181811067ffffffffffffffff82111715610699576106986106d1565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b61072e816105f3565b811461073957600080fd5b5056fea2646970667358221220d9a837d3d043f0dbeae1765403955171797182b365fb08a7859b756522acfbb264736f6c63430008070033",
  //   chainId: 1337,
  // };
  // const sendTxRsp = await wallet.sendTransaction(tx);
  // await sendTxRsp.wait(1);
  // console.log(sendTxRsp);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });