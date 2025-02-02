const networkConfig = {
  11155111: {
    name: "sepolia",
    ethUsdPriceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
  },
  137: {
    name: "polygon",
    ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
  },
};

//测试区块链名
const developmentChains = ["hardhat", "localhost"];

//初始化属性
const DECIMALS = 8;
const INITIAL_ANSWER = 200000000;

//export让其他脚本也能使用
module.exports = {
  networkConfig,
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER,
};
