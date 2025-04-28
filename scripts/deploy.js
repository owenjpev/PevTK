const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const PevTK = await ethers.getContractFactory("PevTK");
    const pevtk = await PevTK.deploy();
    await pevtk.waitForDeployment();
    const address = await pevtk.getAddress();

    console.log("Contract deployed to", address);

    saveFrontendFiles(pevtk);
}

function saveFrontendFiles(contract) {
    const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

    if (!fs.existsSync(contractsDir)) {
        fs.mkdirSync(contractsDir, { recursive: true });
    }

    const addressPath = path.join(contractsDir, "addresses.js");
    const abiPath = path.join(contractsDir, "PevTK.json");

    fs.writeFileSync(
        addressPath,
        `export const PEVTK_ADDRESS = "${contract.target}";\n`
    );

    fs.writeFileSync(
        abiPath,
        JSON.stringify(
            {
                abi: contract.interface.formatJson()
            },
            null,
            2
        )
    );
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});