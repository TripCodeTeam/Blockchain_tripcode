require("ts-node").register();
require("tsconfig-paths/register");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545, // Puerto por defecto de Ganache
      network_id: "*", // Conecta con cualquier red
    },
  },
  compilers: {
    solc: {
      version: "0.8.26", // Versión de Solidity que usas
    },
  },
  mocha: {
    reporter: "spec",
    timeout: 100000
  },
  // Configuración para que Truffle pueda ejecutar migraciones en TypeScript
  migrations_directory: "./migrations",
  contracts_directory: "./contracts",
  contracts_build_directory: './build/contracts',
  plugins: ['truffle-plugin-verify'],
  typescript: true, // Habilitar TypeScript para migraciones
};
