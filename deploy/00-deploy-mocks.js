const { network } = require("hardhat");
const { developmentChains, DECIMALS, INITIAL_PRICE } = require("../helper-hardhat-config");

const BASE_FEE = 0.25e18    // 0.25 LINK premium fee
const GAS_PRICE_LINK = 1e9; // 0.000000001 LINK per gas

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    // If we are on a local development network, we need to deploy mocks!
    if (developmentChains.includes(network.name)) {
        log("-------------------------------------------------------");
        log("Local network detected! Deploying mocks...");

        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: [BASE_FEE, GAS_PRICE_LINK],
        });

        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        });

        log("Mocks Deployed!");
        log("-------------------------------------------------------");
        // You are deploying to a local network, you'll need a local network running to interact
        // Please run `yarn hardhat console --network localhost` to interact with the deployed smart contracts!"
    }
};

module.exports.tags = ["all", "mocks", "main"];
