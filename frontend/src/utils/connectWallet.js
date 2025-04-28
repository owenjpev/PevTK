import { ethers } from 'ethers';

async function connectWallet() {
    if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        return await provider.getSigner();
    } else {
        alert('Please install MetaMask!');
        return null;
    }
}

export default connectWallet;