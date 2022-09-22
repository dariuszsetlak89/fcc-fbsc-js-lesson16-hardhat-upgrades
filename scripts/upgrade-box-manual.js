// Manual way
const { ethers } = require("hardhat");

async function main() {
    const boxProxyAdmin = await ethers.getContract("BoxProxyAdmin");
    const transparentProxy = await ethers.getContract("BoxV1_Proxy");

    const proxyBoxV1 = await ethers.getContractAt("BoxV1", transparentProxy.address);
    const versionV1 = await proxyBoxV1.version();
    console.log(`Box version before upgrade: ${versionV1.toString()} `);

    // Box upgrade!
    const boxV2 = await ethers.getContract("BoxV2");
    const upgradeTx = await boxProxyAdmin.upgrade(transparentProxy.address, boxV2.address);
    await upgradeTx.wait(1);

    const proxyBoxV2 = await ethers.getContractAt("BoxV2", transparentProxy.address);
    const versionV2 = await proxyBoxV2.version();
    console.log(`Box version after upgrade: ${versionV2.toString()}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
