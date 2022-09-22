// Manual way
const { developmentChains } = require("../helper-hardhat-config");
const { network, deployments, deployer } = require("hardhat");
const { verify } = require("../utils/verify");

async function main() {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const boxV2 = await deploy("BoxV2", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.config.waitBlockConfirmations || 1,
    });

    // Verify deployed contract on Etherscan
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(boxV2.address, args);
    }
    log("-------------------------------------------------------");

    // Upgrade!
    // Not "the hardhat-deploy way"
    const boxProxyAdmin = await ethers.getContract("BoxProxyAdmin");
    const transparentProxy = await ethers.getContract("BoxV1_Proxy");
    const upgradeTx = await boxProxyAdmin.upgrade(transparentProxy.address, boxV2.address);
    await upgradeTx.wait(1);
    const proxyBoxV2 = await ethers.getContractAt("BoxV2", transparentProxy.address);
    const version = await proxyBoxV2.version();
    console.log(`Box contract version: ${version.toString()}`);
    log("----------------------------------------------------");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
