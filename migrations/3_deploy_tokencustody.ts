import Web3, { AbiItem } from "web3";
import dotenv from "dotenv";

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Web3 provider
const web3 = new Web3("http://localhost:7545");

// ABI de TokenCustody (obtén el ABI compilado)
const tokenCustodyABI: AbiItem[] = [
    // ABI de TokenCustody aquí
];

// Obtener el bytecode de TokenCustody y la dirección de TripCoin desde las variables de entorno
const tokenCustodyBytecode = process.env.TOKEN_CUSTODY_BYTECODE;
const tripCoinAddress = process.env.TRIP_COIN_ADDRESS;

if (!tokenCustodyBytecode || !tripCoinAddress) {
    console.error("El bytecode de TokenCustody o la dirección de TripCoin no están definidos en el archivo .env");
    process.exit(1);
}

const deployTokenCustody = async (tripCoinAddress: string) => {
    const accounts = await web3.eth.getAccounts();
    const deployer = accounts[0];

    console.log("Deploying TokenCustody with the account:", deployer);

    // Instanciamos el contrato
    const contract = new web3.eth.Contract(tokenCustodyABI);

    // Desplegamos el contrato
    const deployTx = await contract
        .deploy({
            data: tokenCustodyBytecode,
            arguments: [tripCoinAddress], // Se pasa la dirección del contrato de TripCoin
        })
        .send({ from: deployer, gas: Web3.utils.toHex(3000000) });

    console.log("TokenCustody deployed at address:", deployTx.options.address);
    return deployTx.options.address;
};

deployTokenCustody(tripCoinAddress)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
