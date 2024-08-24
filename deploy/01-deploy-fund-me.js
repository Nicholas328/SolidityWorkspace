//之前deploy流程
//import
//main()
//calling of main()
//JS很聪明知道会取network，但是最好定义一下
const { network, ethers } = require("hardhat");
const { verify } = require("../utils/verify");
// require("dotenv").config();

/**
 * yarn hardhat deploy
 */

//方法1
// function deployFunc() {
//   console.log("hii");
// }
// module.exports.default = deployFunc;

//方法2
// module.exports = async (hre) => {
//   const { getNamedAccounts, deployments } = hre;
//   //hre.getNamedAccounts
//   //hre.deployments
// };

/**
 * 等同于
 * const helperConfig = require("../helper-hardhat-config");
 * const networkConfig = helperConfig.networkConfig;
 */
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");

//方法3（常用）
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  //if chainId is X use address Y
  // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  let ethUsdPriceFeedAddress;
  if (developmentChains.includes(network.name)) {
    //Local network get Mocks contract
    const ethUseAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUseAggregator.address;
  } else {
    //Public Network
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  //if the contract doesnt exist, we deploy a minimal verion for local testing

  //What happend when we want to change chains?
  //When going for localhost or hardhat network, we want to use a mock
  const args = [ethUsdPriceFeedAddress];
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args, //put price feed address to create contract (Constructor parm)
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  // console.log("-------------------------------------------");

  //auto verify contract if it is not testnet
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    //verify contract
    await verify(fundMe.address, args);
    // console.log("-------------------------------------------");
  }
};

module.exports.tags = ["all", "fundme"];
