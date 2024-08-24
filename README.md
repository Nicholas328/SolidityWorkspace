# Note

Ethereum Unit Converter
https://eth-converter.com/

EtherScan
https://sepolia.etherscan.io/

Remix
https://remix.ethereum.org/

Chain Link Documentation(Price feed)
https://docs.chain.link/data-feeds/using-data-feeds#solidity
https://docs.chain.link/data-feeds/price-feeds/addresses?network=ethereum&page=1

Solidity 功能案例
https://solidity-by-example.org/sending-ether/

ethers
https://docs.ethers.org/v5/getting-started/

ethers 接口说明
https://playground.open-rpc.org/

用于链接区块链的接口
https://alchemy.com/

Node.js
nvm --version

yarn 和 npm 都是管理 JavaScript 项目的工具

---

版本管理：Yarn 使用一个名为"yarn.lock"的锁定文件，确保每次安装的依赖版本都是一致的，有助于保持开发环境和生产环境的一致性。
npm 使用"package-lock.json"文件来管理依赖包的版本信息，但在过去的版本中可能存在一些不一致的问题。‌

自动解决依赖冲突：Yarn 能够自动解决依赖冲突，确保使用的依赖版本是一致的，有助于减少项目中因依赖冲突而引发的问题。
而 npm 在某些情况下可能需要手动处理依赖冲突。

---

开启 yarn 命令：corepack enable
安装 solc-js 命令：yarn add sol

solc-js 代表 Solidity Complie JS
https://github.com/ethereum/solc-js?tab=readme-ov-file

专门用于在 JS 上开发智能合约的工具
命令行：solcjs --help

export CAT=dog
echo $CAT
dotenv 用于引入环境变量
