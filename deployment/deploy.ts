import { network } from "hardhat";
import "@nomicfoundation/hardhat-toolbox-mocha-ethers";

async function main() {
    const { ethers } = await network.create();

    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    const nft = await ethers.deployContract("SabarthoNFT");
    await nft.waitForDeployment();

    console.log("SabarthoNFT déployé à l'adresse :", await nft.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});