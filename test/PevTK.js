const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PevTK", function () {
    let PevTK, pevtk, owner, user;

    beforeEach(async () => {
        [owner, user] = await ethers.getSigners();
        PevTK = await ethers.getContractFactory("PevTK");
        pevtk = await PevTK.deploy();
        await pevtk.deployed();
    });

    it("should have the correct name and symbol", async () => {
        expect(await pevtk.name()).to.equal("Pev Token");
        expect(await pevtk.symbol()).to.equal("PEVTK");
    });

    it("should allow a user to buy tokens", async () => {
        const tokenPrice = await pevtk.tokenPrice();
        const ethAmount = tokenPrice.mul(10);

        await pevtk.connect(user).buyPevTK({ value: ethAmount });
        const balance = await pevtk.balanceOf(user.address);

        expect(balance).to.equal(10);
    });

    it("should allow a user to sell tokens", async () => {
        const tokenPrice = await pevtk.tokenPrice();
        const ethAmount = tokenPrice.mul(5);

        await pevtk.connect(user).buyPevTK({ value: ethAmount });

        const balanceBefore = await ethers.provider.getBalance(user.address);
        const tx = await pevtk.connect(user).sellPevTK(5);
        const receipt = await tx.wait();
        const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);
        const balanceAfter = await ethers.provider.getBalance(user.address);

        expect(balanceAfter).to.be.above(balanceBefore.sub(gasUsed));
        expect(await pevtk.balanceOf(user.address)).to.equal(0);
    });

    it("should allow the owner to withdraw ETH", async () => {
        const tokenPrice = await pevtk.tokenPrice();

        await pevtk.connect(user).buyPevTK({ value: tokenPrice.mul(20) });

        const contractBalance = await ethers.provider.getBalance(pevtk.address);
        expect(contractBalance).to.equal(tokenPrice.mul(20));

        const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
        const tx = await pevtk.connect(owner).withdraw();
        const receipt = await tx.wait();
        const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);

        const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);

        expect(ownerBalanceAfter).to.be.above(ownerBalanceBefore.sub(gasUsed));
    });
});