// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TripCoin is ERC20 {
    address public owner;

    constructor() ERC20("TripCoin", "TPC") {
        owner = msg.sender;
        _mint(owner, 1000000 * 10 ** decimals());
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function reward(address recipient, uint256 amount) external onlyOwner {
        _transfer(owner, recipient, amount);
    }
}
