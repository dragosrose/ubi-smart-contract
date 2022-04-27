const hre = require("hardhat");


async function main() {
  // We get the contract to deploy
  const UBI = await hre.ethers.getContractFactory("UBI");
  const ubi = await UBI.deploy("0xfB4B8784682247999e9a39382fD6E150ced771A2");
  
  await ubi.deployed();

  console.log("Contract deployed to:", ubi.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
