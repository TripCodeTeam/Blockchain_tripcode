"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hardhat_ethers_1 = require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");
describe("ServiceToken", function () {
    let serviceToken;
    let owner;
    let recipient;
    let otherAccount;
    beforeEach(async function () {
        // Obtener cuentas
        [owner, recipient, otherAccount] = await hardhat_ethers_1.ethers.getSigners();
        // Desplegar contrato
        const ServiceTokenFactory = await hardhat_ethers_1.ethers.getContractFactory("ServiceToken");
        serviceToken = (await ServiceTokenFactory.deploy());
    });
    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            (0, chai_1.expect)(await serviceToken.owner()).to.equal(owner.address);
        });
        it("Should mint initial supply to owner", async function () {
            const initialSupply = hardhat_ethers_1.ethers.parseUnits("1000000", 18);
            const ownerBalance = await serviceToken.balanceOf(owner.address);
            (0, chai_1.expect)(ownerBalance).to.equal(initialSupply);
        });
    });
    describe("Reward Function", function () {
        it("Should allow owner to reward tokens", async function () {
            const rewardAmount = hardhat_ethers_1.ethers.parseUnits("100", 18);
            // Verificar balance inicial
            const initialRecipientBalance = await serviceToken.balanceOf(recipient.address);
            (0, chai_1.expect)(initialRecipientBalance).to.equal(0);
            // Recompensar
            await serviceToken.connect(owner).reward(recipient.address, rewardAmount);
            // Verificar nuevo balance
            const finalRecipientBalance = await serviceToken.balanceOf(recipient.address);
            (0, chai_1.expect)(finalRecipientBalance).to.equal(rewardAmount);
        });
        it("Should revert if non-owner tries to reward", async function () {
            const rewardAmount = hardhat_ethers_1.ethers.parseUnits("100", 18);
            // Intentar recompensar desde cuenta no autorizada
            await (0, chai_1.expect)(serviceToken.connect(otherAccount).reward(recipient.address, rewardAmount)).to.be.revertedWith("Only owner can reward tokens");
        });
    });
    describe("Token Details", function () {
        it("Should have correct token name", async function () {
            (0, chai_1.expect)(await serviceToken.name()).to.equal("ServiceToken");
        });
        it("Should have correct token symbol", async function () {
            (0, chai_1.expect)(await serviceToken.symbol()).to.equal("STK");
        });
        it("Should have 18 decimals", async function () {
            (0, chai_1.expect)(await serviceToken.decimals()).to.equal(18);
        });
    });
});
