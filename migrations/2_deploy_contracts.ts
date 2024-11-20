const Token = artifacts.require("ServiceToken");

module.exports = async function (deployer: any) {
  await deployer.deploy(Token);
};
