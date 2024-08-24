const { ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContractAt("FundMe", deployer);
  console.log("Withdrawing contract...");
  const transRsp = await fundMe.withdraw();
  await transRsp.wait(1);
  console.log("Withdraw");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
