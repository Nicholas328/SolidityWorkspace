const { assert, expect } = require("chai");
const { ethers, network, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe Staging Tests", async () => {
      let deployer;
      let fundMe;
      let sendValue = ethers.parseUnits("0.1", "ether");

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContractAt("FundMe", deployer);
      });

      it("allows people to fund and withdraw", async function () {
        const fundTxResponse = await fundMe.fund({ value: sendValue });
        await fundTxResponse.wait(1);
        const withdrawTxResponse = await fundMe.withdraw();
        await withdrawTxResponse.wait(1);

        const endingFundMeBalance = await ethers.provider.getBalance(
          fundMe.getAddress()
        );
        const endingDeployerBalance = await ethers.provider.getBalance(
          deployer
        );

        assert.equal(
          endingFundMeBalance.toString(),
          endingDeployerBalance.toString()
        );
      });
    });
