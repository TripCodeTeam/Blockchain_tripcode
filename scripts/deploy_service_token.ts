const { ethers } = require("hardhat");

async function main() {
    // Obtener el contrato y desplegarlo
    const ServiceTokenFactory = await ethers.getContractFactory("ServiceToken");
    const serviceToken = await ServiceTokenFactory.deploy();

    await serviceToken.deployed();
    console.log("ServiceToken deployed to:", serviceToken.address);
}

// Manejar errores
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
