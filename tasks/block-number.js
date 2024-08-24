const { task } = require("hardhat/config");

task("block-number", "Printe the current block number").setAction(
    //Anonymous function
    async (taskArgs, hre) => {
        const blockNum = await hre.ethers.provider.getBlockNumber();
        console.log("Current block number: " + blockNum);
    }
);
