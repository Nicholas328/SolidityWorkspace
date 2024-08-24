const { ethers } = require("hardhat");
const { assert, expect } = require("chai");

describe("SimpleStorage tests", function () {
    let contractFactory, contract;
    beforeEach(async function () {
        contractFactory = await ethers.getContractFactory("SimpleStorage");
        contract = await contractFactory.deploy();
    });

    it("Should start with number 0", async function () {
        let num = await contract.getNum();
        //assert() / expect()
        // assert.equal(num, 0);
        expect(num).to.equal(0);
    });

    it("Number should be 66", async function () {
        let num = await contract.storeNum(66);
        await num.wait(1);
        let getNum = await contract.getNum();
        assert.equal(getNum, 66);
    });
});
