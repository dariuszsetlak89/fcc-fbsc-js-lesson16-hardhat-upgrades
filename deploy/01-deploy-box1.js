const { developmentChains } = require("../helper-hardhat-config");

const { network } = require("hardhat");
const { verify } = require("../utils/verify");

// 1. Upgrade BoxV1 -> BoxV2
// 2. Proxy -> BoxV1
//             BoxV2

// 1. Deploy a Proxy manually (similar to sublesson)
// 2. hardhat-deploy's built-in proxies <- IMPLEMENTED
// 3. Openzeppelin upgrades plugin <- in scripts/otherUpgradeExamples

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const boxV1 = await deploy("BoxV1", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.config.waitBlockConfirmations || 1,
        proxy: {
            proxyContract: "OpenZeppelinTransparentProxy",
            viaAdminContract: {
                name: "BoxProxyAdmin",
                artifact: "BoxProxyAdmin",
            },
        },
    });

    // Be sure to check out the hardhat-deploy examples to use UUPS proxies!
    // https://github.com/wighawag/template-ethereum-contracts

    // Verify deployed contract on Etherscan
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(boxV1.address, args);
    }

    log("-------------------------------------------------------");
};

module.exports.tags = ["all", "boxV1"];
