import Web3, { AbiItem } from "web3";
import dotenv from "dotenv";

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Proveedor de Web3
const web3 = new Web3("http://localhost:7545");

// ABI de PaymentVerifier (obtén el ABI compilado)
const paymentVerifierABI: AbiItem[] = [
    // ABI de PaymentVerifier aquí
];

// Obtener el bytecode de PaymentVerifier y la dirección de TripCoin desde las variables de entorno
const paymentVerifierBytecode = process.env.PAYMENT_VERIFIER_BYTECODE;
const tripCoinAddress = process.env.TRIP_COIN_ADDRESS;

if (!paymentVerifierBytecode || !tripCoinAddress) {
    console.error("El bytecode de PaymentVerifier o la dirección de TripCoin no están definidos en el archivo .env");
    process.exit(1);
}

const deployPaymentVerifier = async (tripCoinAddress: string) => {
    const accounts = await web3.eth.getAccounts();
    const deployer = accounts[0];

    console.log("Deploying PaymentVerifier with the account:", deployer);

    // Instanciamos el contrato
    const contract = new web3.eth.Contract(paymentVerifierABI);

    // Desplegamos el contrato
    const deployTx = await contract
        .deploy({
            data: paymentVerifierBytecode,
            arguments: [tripCoinAddress], // Se pasa la dirección del contrato de TripCoin
        })
        .send({ from: deployer, gas: Web3.utils.toHex(3000000) });

    console.log("PaymentVerifier deployed at address:", deployTx.options.address);
    return deployTx.options.address;
};

deployPaymentVerifier(tripCoinAddress)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
