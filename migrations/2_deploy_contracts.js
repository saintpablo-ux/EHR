var Healthcare = artifacts.require("./Healthcare.sol");
var SimpleStorage = artifacts.require("./SimpleStorage.sol");

module.exports = function (deployer) {
  deployer.deploy(Healthcare);
  deployer.deploy(SimpleStorage);
};