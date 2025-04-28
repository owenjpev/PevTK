// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PevTK is ERC20, Ownable {
    // Price of 1 token (we'll set it to 0.002 ETH per token)
    uint public tokenPrice;

    // Events for the frontend
    event PevTKBought(address indexed buyer, uint256 amount);
    event PevTKSold(address indexed seller, uint256 amount);
    event Withdrawal(address indexed owner, uint256 amount);

    constructor() ERC20("PevToken", "PevTK") Ownable(msg.sender) {
        // Set the initial price (0.002 ETH per token)
        tokenPrice = 0.002 ether;
    }

    /**
        * @notice Allows users to purchase PevTK tokens by sending ETH
        * Tokens are minted based on the amount of ETH sent and the current token price
    */
    function buyPevTK() public payable {
        uint256 buyAmount = msg.value / tokenPrice;
        require(buyAmount > 0, "Not enough ETH sent!");
        mint(msg.sender, buyAmount);
        emit PevTKBought(msg.sender, buyAmount);
    }

    /**
        * @notice Allows users to sell their PevTK tokens in exchange for ETH
        * Tokens are burned, and the equivalent ETH is sent to the user
    */
    function sellPevTK(uint256 amount) public {
        require(balanceOf(msg.sender) >= amount, "Insufficient token balance!");
        uint256 sellAmount = amount * tokenPrice;
        _burn(msg.sender, amount);
        (bool sent, ) = msg.sender.call{value: sellAmount}("");
        require(sent, "ETH transfer failed!");
        emit PevTKSold(msg.sender, sellAmount);
    }

    /**
        * @dev Internal function to mint tokens
        * Used by buyPevTK()
    */
    function mint(address to, uint256 amount) internal {
        _mint(to, amount);
    }

    /**
        * @dev Internal function to burn tokens
        * Currently unused but included for potential future logic
    */
    function burn(uint256 amount) internal {
        _burn(msg.sender, amount);
    }

    /**
        * @notice Withdraws the entire ETH balance of the contract to the owner
    */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "There's no ETH to withdraw!");
        (bool sent, ) = owner().call{value: balance}("");
        require(sent, "Withdrawal failed!");
        emit Withdrawal(owner(), balance);
    }

    // Accept ETH sent directly to the contract
    receive() external payable {}

    // Fallback for non-matching function calls
    fallback() external payable {}
}