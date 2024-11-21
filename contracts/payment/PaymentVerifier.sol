// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract PaymentVerifier {
    // Owner's address (only the owner can register payments)
    address public owner;

    // Structure to store the payment hash
    // Here we store the minimal payment details, such as the hash and timestamp.
    struct Payment {
        string paymentHash; // The hash of the payment generated off-chain
        uint256 timestamp; // Timestamp when the payment was registered
        bool verified; // Indicates if the payment has been verified (always true in this case)
    }

    // Mapping to store the payment hash based on a unique ID called `proofId`
    mapping(string => Payment) public payments;

    // Event emitted whenever a payment is registered
    event PaymentRegistered(string proofId, string paymentHash);

    // Modifier to ensure that only the contract owner can call certain functions
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _; // Executes the function that uses this modifier
    }

    // Constructor of the contract, assigns the deployer's address as the owner
    constructor() {
        owner = msg.sender;
    }

    /**
     * Function to register a confirmed payment on the blockchain.
     * Only the owner can register payments.
     * @param proofId The unique ID that links the payment with the external system (e.g., a payment gateway)
     * @param paymentHash The hash generated off-chain, representing the payment data
     */
    function registerPayment(
        string memory proofId, // Unique ID to link with the external system
        string memory paymentHash // Payment hash generated in the backend
    ) external onlyOwner {
        // Ensure that the payment has not been registered already using the same proofId
        require(payments[proofId].timestamp == 0, "Payment already registered");

        // Store the payment information (only the hash and timestamp)
        payments[proofId] = Payment({
            paymentHash: paymentHash, // Store only the hash for privacy and efficiency
            timestamp: block.timestamp, // Store the timestamp when it was registered
            verified: true // Mark the payment as verified (could be useful if there are other states)
        });

        // Emit an event to notify that a payment has been registered
        emit PaymentRegistered(proofId, paymentHash);
    }

    /**
     * Function to get the details of a payment given a `proofId`.
     * @param proofId The ID of the payment we want to retrieve
     * @return paymentHash The stored hash of the payment
     * @return timestamp The timestamp when the payment was registered
     */
    function getPayment(
        string memory proofId
    ) external view returns (string memory, uint256) {
        // Ensure the payment exists (i.e., that the proofId is not empty or non-existent)
        require(payments[proofId].timestamp != 0, "Payment not found");

        // Return the payment hash and the timestamp when it was registered
        return (payments[proofId].paymentHash, payments[proofId].timestamp);
    }
}
