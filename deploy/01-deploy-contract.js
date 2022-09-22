const { network, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getUnnamedAccounts();

    // Deploy contract
    let args = [];
    const contract = await deploy("contract"), {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    }

    // Verify deployed contract on Etherscan
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(nftMarketplace.address, args);
    }

    log("-------------------------------------------------------");
};

module.exports.tags = ["all, contract"];