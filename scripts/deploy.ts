import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import child_process from "child_process";

dotenv.config();

// Ruta a los archivos compilados de Truffle
const tripCoinContractPath = path.join(__dirname, "..", "build", "contracts", "TripCoin.json");
const paymentVerifierContractPath = path.join(__dirname, "..", "build", "contracts", "PaymentVerifier.json");
const tokenCustodyContractPath = path.join(__dirname, "..", "build", "contracts", "TokenCustody.json");

// Función para leer los archivos de contrato compilados
const getContractData = (filePath: string): any | null => {
    try {
        const rawData = fs.readFileSync(filePath, "utf8");
        return JSON.parse(rawData);
    } catch (error) {
        console.error(`Error reading contract file at ${filePath}:`, error);
        return null;
    }
};

// Obtener datos de los contratos
const tripCoinData = getContractData(tripCoinContractPath);
const paymentVerifierData = getContractData(paymentVerifierContractPath);
const tokenCustodyData = getContractData(tokenCustodyContractPath);

// Si los contratos fueron obtenidos correctamente, proceder
if (tripCoinData && paymentVerifierData && tokenCustodyData) {
    const tripCoinABI = JSON.stringify(tripCoinData.abi);
    const tripCoinBytecode = tripCoinData.bytecode;

    const paymentVerifierABI = JSON.stringify(paymentVerifierData.abi);
    const paymentVerifierBytecode = paymentVerifierData.bytecode;

    const tokenCustodyABI = JSON.stringify(tokenCustodyData.abi);
    const tokenCustodyBytecode = tokenCustodyData.bytecode;

    // Ruta del archivo .env
    const envFilePath = path.join(__dirname, "..", ".env");

    // Comprobamos si el archivo .env existe y lo creamos si no
    if (!fs.existsSync(envFilePath)) {
        fs.writeFileSync(envFilePath, "");
    }

    // Agregar variables al archivo .env
    const newEnvContent = `
    TRIP_COIN_ABI='${tripCoinABI}'
    TRIP_COIN_BYTECODE='${tripCoinBytecode}'
    PAYMENT_VERIFIER_ABI='${paymentVerifierABI}'
    PAYMENT_VERIFIER_BYTECODE='${paymentVerifierBytecode}'
    TOKEN_CUSTODY_ABI='${tokenCustodyABI}'
    TOKEN_CUSTODY_BYTECODE='${tokenCustodyBytecode}'
  `;

    fs.appendFileSync(envFilePath, newEnvContent, "utf8");

    console.log("ABI y bytecode de los contratos han sido añadidos al archivo .env");
} else {
    console.error("No se pudieron obtener todos los contratos.");
}

// Función para compilar TypeScript y ejecutar el script generado
const compileAndRunScript = () => {
    console.log("Compilando TypeScript...");

    child_process.exec("tsc scripts/deploy.ts", (err, stdout, stderr) => {
        if (err) {
            console.error(`Error al compilar TypeScript: ${stderr}`);
            return;
        }

        console.log("Compilación exitosa.");
        console.log(stdout);

        // Ejecutar el archivo JavaScript resultante
        console.log("Ejecutando el script...");
        child_process.exec("node scripts/deploy.js", (err, stdout, stderr) => {
            if (err) {
                console.error(`Error al ejecutar el script: ${stderr}`);
                return;
            }

            console.log("Script ejecutado correctamente.");
            console.log(stdout);
        });
    });
};

// Ejecutar la compilación y ejecución
compileAndRunScript();
