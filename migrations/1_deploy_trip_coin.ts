import Web3, { AbiItem } from "web3";
import dotenv from "dotenv"

dotenv.config()

// Configuración de Web3
const web3 = new Web3("http://localhost:7545"); // Dirección de tu nodo (puede ser Ganache, Infura, etc.)

const contractABI: AbiItem[] = [
    // Aquí iría el ABI de tu contrato
];

// Dirección del contrato
const contractAddress = process.env.CONTRACT_ADDRESS;

async function main() {
    const accounts = await web3.eth.getAccounts();
    const deployer = accounts[0]; // Dirección del desplegador

    console.log("Deploying contracts with the account:", deployer);

    // Instanciar el contrato
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // Llamar a una función del contrato, por ejemplo, para desplegar
    const tx = await contract.methods.someMethod().send({ from: deployer });
    console.log("Transaction sent:", tx.transactionHash);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
