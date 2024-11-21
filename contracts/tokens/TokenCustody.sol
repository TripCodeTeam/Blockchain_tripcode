// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenCustody {
    address public owner;
    IERC20 public serviceTokenContract;

    mapping(bytes32 => uint256) public balances;

    event TokensAssigned(bytes32 indexed clientIdHash, uint256 amount);
    event TokensWithdrawn(
        bytes32 indexed clientIdHash,
        address recipient,
        uint256 amount
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(address _serviceTokenAddress) {
        owner = msg.sender;
        serviceTokenContract = IERC20(_serviceTokenAddress); // Instancia del contrato ERC-20
    }

    function assignTokens(
        string memory clientId,
        uint256 amount
    ) external onlyOwner {
        bytes32 clientIdHash = keccak256(abi.encodePacked(clientId));
        balances[clientIdHash] += amount;

        emit TokensAssigned(clientIdHash, amount);
    }

    function getBalance(
        string memory clientId
    ) external view returns (uint256) {
        bytes32 clientIdHash = keccak256(abi.encodePacked(clientId));
        return balances[clientIdHash];
    }

    function withdrawTokens(
        string memory clientId,
        address recipient,
        uint256 amount
    ) external onlyOwner {
        bytes32 clientIdHash = keccak256(abi.encodePacked(clientId));
        require(balances[clientIdHash] >= amount, "Insufficient balance");

        // Actualiza el balance interno
        balances[clientIdHash] -= amount;

        // Transfiere tokens reales desde el contrato ERC-20 al destinatario
        require(
            serviceTokenContract.transfer(recipient, amount),
            "Token transfer failed"
        );

        emit TokensWithdrawn(clientIdHash, recipient, amount);
    }
}
