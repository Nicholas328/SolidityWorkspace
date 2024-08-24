const { ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContractAt("FundMe", deployer);
  console.log("Funding contract...");
  const transRsp = await fundMe.fund({
    value: ethers.parseUnits("1", "ether"),
  });
  await transRsp.wait(1);
  console.log("Funded");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
