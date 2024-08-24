const { assert, expect } = require("chai");
const { deployments, ethers, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async () => {
      let FundMe;
      let signer;
      let MockV3Aggregator;
      let sendValue = ethers.parseUnits("1", "ether");
      beforeEach(async () => {
        // console.log(await deployments.all());
        // don't use (await getNamedAccounts()).deployer, as a parameter to the getContractAt function, it will report an error !!!
        const accounts = await ethers.getSigners();
        signer = accounts[0];
        await deployments.fixture(["all"]);

        // there is no getContract function in ethers, so using getContractAt
        const FundMeDeployment = await deployments.get("FundMe");
        FundMe = await ethers.getContractAt(
          FundMeDeployment.abi,
          FundMeDeployment.address,
          signer
        );
        const MockV3AggregatorDeployment = await deployments.get(
          "MockV3Aggregator"
        );
        MockV3Aggregator = await ethers.getContractAt(
          MockV3AggregatorDeployment.abi,
          MockV3AggregatorDeployment.address,
          signer
        );
      });

      describe("constructor", async () => {
        it("sets the aggregator address correctly", async () => {
          const response = await FundMe.getPriceFeed();
          // get address using target instead of address property
          assert.equal(response, MockV3Aggregator.target);
        });
      });

      describe("fund", async () => {
        it("Fails if you don't send enough ETH", async () => {
          await expect(FundMe.fund()).to.be.revertedWith(
            "You need to spend more ETH!"
          );
        });

        it("update the amount funded data structure", async () => {
          await FundMe.fund({ value: sendValue });
          const response = await FundMe.getAddressToAmountFunded(signer);
          assert.equal(response.toString(), sendValue.toString());
        });

        it("adds funder to array of funders", async () => {
          await FundMe.fund({ value: sendValue });
          const response = await FundMe.getFunders(0);
          assert.equal(response, signer.address);
        });
      });

      describe("withdraw", async () => {
        //Before every test, fund the contract with 1 Eth
        beforeEach(async () => {
          await FundMe.fund({ value: sendValue });
        });

        it("withdraws ETH from a single funder", async () => {
          //Arrange
          const strFundMeBal = await ethers.provider.getBalance(FundMe);
          const strDeployerBal = await ethers.provider.getBalance(signer);
          //Act
          const response = await FundMe.withdraw();
          const responseReceipt = await response.wait(1);
          //Gas v6 ethers fee represents gas cost
          const { fee } = responseReceipt;
          //Assert
          const endFundMeBal = await ethers.provider.getBalance(FundMe);
          const endDeployerBal = await ethers.provider.getBalance(signer);
          //原合约+原账户 = 原账户+转出金额(扣了gas)+fee
          assert.equal(strFundMeBal + strDeployerBal, endDeployerBal + fee);
        });

        it("withdraw with multiple funders", async () => {
          const accounts = await ethers.getSigners();
          //Start with 1 because 0 is the deployer
          for (let i = 1; i < 6; i++) {
            const fundMeConnectedContract = await FundMe.connect(accounts[i]);
            await fundMeConnectedContract.fund({ value: sendValue });
          }
          //Arrange
          const strFundMeBal = await ethers.provider.getBalance(FundMe);
          const strDeployerBal = await ethers.provider.getBalance(signer);
          //Act
          const response = await FundMe.withdraw();
          const responseReceipt = await response.wait(1);
          //Gas v6 ethers fee represents gas cost
          const { fee } = responseReceipt;
          //Assert
          const endFundMeBal = await ethers.provider.getBalance(FundMe);
          const endDeployerBal = await ethers.provider.getBalance(signer);
          assert.equal(endFundMeBal, 0);
          assert.equal(strFundMeBal + strDeployerBal, endDeployerBal + fee);
          //Make sure funders array is reset properly
          await expect(FundMe.getFunders(0)).to.be.reverted;
          //Make sure all funders are in 0 mapping
          for (let i = 1; i < 6; i++) {
            assert.equal(await FundMe.getAddressToAmountFunded(accounts[i]), 0);
          }
        });

        it("only allow the owner to withdraw", async () => {
          const accounts = await ethers.getSigners();
          const attacker = accounts[1];
          const fundMeConnectedContract = await FundMe.connect(attacker);
          await expect(
            fundMeConnectedContract.withdraw()
          ).to.be.revertedWithCustomError(FundMe, "FundMe__NotOwner");
        });

        it("cheaperWithdraws ETH from a single funder", async () => {
          //Arrange
          const strFundMeBal = await ethers.provider.getBalance(FundMe);
          const strDeployerBal = await ethers.provider.getBalance(signer);
          //Act
          const response = await FundMe.cheaperWithdraw();
          const responseReceipt = await response.wait(1);
          //Gas v6 ethers fee represents gas cost
          const { fee } = responseReceipt;
          //Assert
          const endFundMeBal = await ethers.provider.getBalance(FundMe);
          const endDeployerBal = await ethers.provider.getBalance(signer);
          //原合约+原账户 = 原账户+转出金额(扣了gas)+fee
          assert.equal(strFundMeBal + strDeployerBal, endDeployerBal + fee);
        });

        it("cheaperWithdraw with multiple funders", async () => {
          const accounts = await ethers.getSigners();
          //Start with 1 because 0 is the deployer
          for (let i = 1; i < 6; i++) {
            const fundMeConnectedContract = await FundMe.connect(accounts[i]);
            await fundMeConnectedContract.fund({ value: sendValue });
          }
          //Arrange
          const strFundMeBal = await ethers.provider.getBalance(FundMe);
          const strDeployerBal = await ethers.provider.getBalance(signer);
          //Act
          const response = await FundMe.cheaperWithdraw();
          const responseReceipt = await response.wait(1);
          //Gas v6 ethers fee represents gas cost
          const { fee } = responseReceipt;
          //Assert
          const endFundMeBal = await ethers.provider.getBalance(FundMe);
          const endDeployerBal = await ethers.provider.getBalance(signer);
          assert.equal(endFundMeBal, 0);
          assert.equal(strFundMeBal + strDeployerBal, endDeployerBal + fee);
          //Make sure funders array is reset properly
          await expect(FundMe.getFunders(0)).to.be.reverted;
          //Make sure all funders are in 0 mapping
          for (let i = 1; i < 6; i++) {
            assert.equal(await FundMe.getAddressToAmountFunded(accounts[i]), 0);
          }
        });
      });
    });
