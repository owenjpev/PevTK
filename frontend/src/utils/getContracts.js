import { ethers } from "ethers";
import { PEVTK_ADDRESS } from "../contracts/addresses";
import PevTK from "../contracts/PevTK.json";

let contractsCache = null;
let connecting = false;

export async function getContracts() {
	if (contractsCache) return contractsCache;
	
	if (!window.ethereum) {
		await new Promise((res) => setTimeout(res, 500));
		if (!window.ethereum) return null;
	}

	connecting = true;

	try {
		const provider = new ethers.BrowserProvider(window.ethereum);
		const accounts = await provider.send("eth_accounts", []);
		
		if (accounts.length === 0) {
			await provider.send("eth_requestAccounts", []);
		}

		const signer = await provider.getSigner();
		const pevTk = new ethers.Contract(
			PEVTK_ADDRESS,
			PevTK.abi,
			signer
		);

		contractsCache = { pevTk, signer, provider };
		return contractsCache;
	} catch (err) {
		console.error("Connection error:", err);
		return null;
	} finally {
		connecting = false;
	}
}