const { expect } = require("chai");
const { ServiceToken } = require("../build/types");  // Ruta al tipo generado por Truffle
const Web3 = require("web3"); // Web3.js para interactuar con el contrato

// Configuración de Web3
const web3 = new Web3("http://localhost:7545"); // Asegúrate de que Truffle esté corriendo en localhost:7545
let accounts: string[];

// Configuración de los contratos
let serviceToken: any;
let owner: string;
let recipient: string;
let otherAccount: string;

beforeEach(async function () {
    // Obtener cuentas desde Truffle
    accounts = await web3.eth.getAccounts();
    owner = accounts[0];
    recipient = accounts[1];
    otherAccount = accounts[2];

    // Desplegar el contrato
    const ServiceTokenArtifact = require("../build/contracts/ServiceToken.json");
    const ServiceTokenContract = new web3.eth.Contract(ServiceTokenArtifact.abi);
    serviceToken = await ServiceTokenContract.deploy({ data: ServiceTokenArtifact.bytecode })
        .send({ from: owner, gas: 3000000 });
});

describe("ServiceToken", function () {
    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            const contractOwner = await serviceToken.methods.owner().call();
            expect(contractOwner).to.equal(owner);
        });

        it("Should mint initial supply to owner", async function () {
            const initialSupply = web3.utils.toWei("1000000", "ether");
            const ownerBalance = await serviceToken.methods.balanceOf(owner).call();
            expect(ownerBalance).to.equal(initialSupply);
        });
    });

    describe("Reward Function", function () {
        it("Should allow owner to reward tokens", async function () {
            const rewardAmount = web3.utils.toWei("100", "ether");

            // Verificar balance inicial
            const initialRecipientBalance = await serviceToken.methods.balanceOf(recipient).call();
            expect(initialRecipientBalance).to.equal("0");

            // Recompensar
            await serviceToken.methods.reward(recipient, rewardAmount).send({ from: owner });

            // Verificar nuevo balance
            const finalRecipientBalance = await serviceToken.methods.balanceOf(recipient).call();
            expect(finalRecipientBalance).to.equal(rewardAmount);
        });

        it("Should revert if non-owner tries to reward", async function () {
            const rewardAmount = web3.utils.toWei("100", "ether");

            // Intentar recompensar desde cuenta no autorizada
            try {
                await serviceToken.methods.reward(recipient, rewardAmount).send({ from: otherAccount });
                throw new Error("Expected revert, but did not get one.");
            } catch (error) {
                const typedError = error as Error
                expect(typedError.message).to.include("Only owner can reward tokens");
            }
        });
    });

    describe("Token Details", function () {
        it("Should have correct token name", async function () {
            const tokenName = await serviceToken.methods.name().call();
            expect(tokenName).to.equal("ServiceToken");
        });

        it("Should have correct token symbol", async function () {
            const tokenSymbol = await serviceToken.methods.symbol().call();
            expect(tokenSymbol).to.equal("STK");
        });

        it("Should have 18 decimals", async function () {
            const decimals = await serviceToken.methods.decimals().call();
            expect(decimals).to.equal("18");
        });
    });
});
