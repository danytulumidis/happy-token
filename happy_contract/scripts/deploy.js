const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {
  const happyTokenContract = await ethers.getContractFactory("HappyToken");

  // deploy the contract
  const deployedHappyTokenContract = await happyTokenContract.deploy(
    "Happy Token",
    "HAPPY",
    100
  );

  console.log(
    "Happy Token Address:",
    deployedHappyTokenContract.address
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });