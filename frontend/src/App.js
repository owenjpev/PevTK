/* global BigInt */

import { ethers } from "ethers";
import { getContracts } from "./utils/getContracts";
import { useEffect, useState, useRef } from "react";
import './App.css';

function App() {
	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);
	const [balance, setBalance] = useState(0);
	const [inputAmount, setInputAmount] = useState("");
	const [tokenPrice, setTokenPrice] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [ethBalance, setEthBalance] = useState(null);
	const [isOwner, setIsOwner] = useState(false);

	const notificationRef = useRef(null);
	const messageRef = useRef(null);
	const iconRef = useRef(null);

	useEffect(() => {
		async function init() {
			const contracts = await getContracts();
			if (!contracts) {
				alert("Please install MetaMask");
				return;
			}
		
			const { pevTk, signer, provider } = contracts;
			setContract(pevTk);
			setSigner(signer);
			setProvider(provider);
		
			const userAddress = await signer.getAddress();
			const balance = await pevTk.balanceOf(userAddress);
			const ethBalance = await provider.getBalance(userAddress);

			setBalance(Number(balance));
			setEthBalance(ethers.formatEther(balance));
		
			const price = await pevTk.tokenPrice();
			const formattedPrice = Number(ethers.formatEther(price));
			setTokenPrice(formattedPrice.toFixed(3));

			const contractOwner = await pevTk.owner();
			setIsOwner(contractOwner.toLowerCase() === userAddress.toLowerCase());
		}
		init();
	}, []);

	function showNotification(message, success = true) {
		const notification = notificationRef.current;
		const notificationMessage = messageRef.current;
		const notificationIcon = iconRef.current;
	
		if (!notification || !notificationMessage || !notificationIcon) return;
	
		notification.className = 'notification';
		if (success) {
			notification.classList.add('success');
		} else {
			notification.classList.remove('success');
		}
	
		notificationIcon.innerHTML = `<i class="fa-solid fa-circle-${success ? 'check' : 'xmark'}"></i>`;
		notificationMessage.textContent = message;
		notification.classList.add('show');
	
		setTimeout(() => {
			notification.classList.remove('show');
		}, 3000);
	}

	function formatError(error) {
		if (!error) {
			return "Something went wrong...";
		}
	
		if (error.reason) {
			return error.reason;
		}
	
		if (error.revert && Array.isArray(error.revert.args) && error.revert.args.length > 0) {
			return error.revert.args[0];
		}
	
		if (error.message) {
			let message = error.message;
			const revertedIndex = message.indexOf("execution reverted: ");
			if (revertedIndex !== -1) {
				message = message.slice(revertedIndex + "execution reverted: ".length);
			}
			return message;
		}
	
		return "Something went wrong...";
	}

	const refreshBalance = async () => {
		if (!contract || !signer) return;
		const userAddress = await signer.getAddress();
		const balance = await contract.balanceOf(userAddress);
		setBalance(Number(balance));
	}

	const buyTokens = async () => {
		if (isLoading) return;
		setIsLoading(true);

		try {
			if (!/^\d+$/.test(inputAmount)) {
				showNotification(`Please enter a valid whole number!`, false);
				return;
			}

			const tokenPrice = await contract.tokenPrice();
			const amount = BigInt(inputAmount);
			const value = tokenPrice * amount;
	
			const tx = await contract.buyPevTK({ value });
			await tx.wait();
	
			showNotification(`Bought ${inputAmount} tokens!`, true);
			refreshBalance();
		} catch (error) {
			console.error(error);
			showNotification(`Purchase failed: ${formatError(error)}`, false);
		} finally {
			setIsLoading(false);
		}
	}

	const sellTokens = async () => {
		if (isLoading) return;
		setIsLoading(true);
		
		try {
			if (!/^\d+$/.test(inputAmount)) {
				showNotification(`Please enter a valid whole number!`, false);
				return;
			}

			const tx = await contract.sellPevTK(inputAmount);
			await tx.wait();
	
			showNotification(`Sold ${inputAmount} tokens!`, true);
			refreshBalance();
		} catch (error) {
			console.error(error);
			showNotification(`Sale failed: ${formatError(error)}`, false);
		} finally {
			setIsLoading(false);
		}
	}

	const withdrawFunds = async () => {
		if (isLoading) return;
		setIsLoading(true);

		try {
			const tx = await contract.withdraw();
			await tx.wait();
			
			showNotification(`Withdrawal successful!`, true)
			refreshBalance();
		} catch (error) {
			console.error(error);
			showNotification(`Withdrawal failed: ${formatError(error)}`, false);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<>
			<div className="notification" ref={notificationRef}>
				<span className="notification-icon" ref={iconRef}></span>
				<span className="notification-message" ref={messageRef}></span>
			</div>
			<main className="main-content">
				<div className="card">
					<h1 className="title">My first smart contract!</h1>
					<p className="description">
						<strong>PevToken (PevTK)</strong> is a simple ERC20 token built on Ethereum, designed to demonstrate core smart contract functionality. 
						You can buy and sell tokens directly from the contract using ETH, with instant minting and burning. 
						This little project showcases some basic concepts in Solidity, smart contract development, and web3 frontend integration using React and Ethers.js.
					</p>
					<div className="group" style={{ marginBottom: '32px' }}>
						<p className="group-title">Stats</p>
						<div className="stats">
							<div className="stat">
								<p className="stat-title">Current PevTK price</p>
								<p className="stat-text">
									{tokenPrice !== null ? `${tokenPrice} ETH` : "Loading..."}
								</p>
							</div>
							<div className="stat">
								<p className="stat-title">Your PevTK balance</p>
								<p className="stat-text">{balance} PevTK</p>
							</div>
						</div>
						<p className="tiny-text">You have {ethBalance} ETH in your wallet</p>
					</div>
					<div className="group">
						<p className="group-title" style={{ marginBottom: '12px' }}>Action</p>
						<div className="flex-row mobile-wrap" style={{ alignItems: 'flex-start', gap: '12px' }}>
							<div className="form-group">
								<label>Amount</label>
								<input
									placeholder="e.g., 10"
									value={inputAmount}
									onChange={(e) => setInputAmount(e.target.value)}
								/>
								{tokenPrice && inputAmount && /^\d+$/.test(inputAmount) && (
									<p className="tiny-text">≈ Estimated cost: {(tokenPrice * parseInt(inputAmount)).toFixed(3)} ETH</p>
								)}
							</div>
							<div className="buttons flex-row">
								<button onClick={buyTokens} disabled={isLoading}>Buy</button>
								<button onClick={sellTokens} disabled={isLoading}>Sell</button>
							</div>
						</div>
						{isOwner && (
							<button className="withdraw-button" onClick={withdrawFunds} disabled={isLoading}>Withdraw funds</button>
						)}
					</div>
				</div>
			</main>
		</>
	);
}

export default App;