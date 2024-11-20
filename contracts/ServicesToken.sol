// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ServiceToken is ERC20 {
    address public owner;

    constructor() ERC20("ServiceToken", "STK") {
        owner = msg.sender;
        _mint(msg.sender, 1000000 * 10 ** decimals()); // Mint inicial
    }

    // Función para recompensar a los clientes
    function reward(address recipient, uint256 amount) external {
        require(msg.sender == owner, "Only owner can reward tokens");
        _transfer(owner, recipient, amount);
    }
}
