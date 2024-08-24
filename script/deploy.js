//imports
const { ethers, run, network } = require("hardhat");

//async function
async function main() {
    const simpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    );

    console.log("Deploying contract...");
    const contract = await simpleStorageFactory.deploy();
    console.log("Contract Address: " + (await contract.getAddress()));

    //Print network info
    // console.log(network.config);

    /**
     * 4 == 4   -> true
     * 4 == "4" -> true
     * 4 === "4"-> false
     */
    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        //Wait 6 blocks to be confirmed before verifying
        await contract.deploymentTransaction().wait(6);
        //Verify contract
        await verify(await contract.getAddress(), []);
    }

    //Get current value
    const currentValue = await contract.getNum();
    console.log("Current value is: " + currentValue);

    //Update the current value
    const tranRsp = await contract.storeNum(66);
    await tranRsp.wait(1);
    const updatedValue = await contract.getNum();
    console.log("Updated value is: " + updatedValue);
}

async function verify(contractAddress, args) {
    console.log("Verifying contract...");
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArgsParams: args,
        });
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Contract already verified");
        } else {
            console.log(e);
        }
    }
}

//main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
