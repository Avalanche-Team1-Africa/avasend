// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IMobileMoneyProvider
 * @dev Interface for mobile money providers like M-Pesa, Airtel Money, etc.
 * This is an abstract representation as the actual integration will happen off-chain
 * through oracles or API calls.
 */
interface IMobileMoneyProvider {
    /**
     * @dev Enum representing the status of a mobile money transfer
     */
    enum TransferStatus {
        PENDING,
        COMPLETED,
        FAILED
    }

    /**
     * @dev Enum representing the different mobile money providers
     */
    enum ProviderType {
        MPESA,
        AIRTEL,
        ORANGE,
        MTN
    }

    /**
     * @dev Struct representing a mobile money transfer
     */
    struct Transfer {
        bytes32 id;
        address sender;
        string phoneNumber;
        uint256 amount;
        ProviderType provider;
        string countryCode;
        TransferStatus status;
        uint256 timestamp;
    }

    /**
     * @dev Initiates a mobile money transfer
     * @param phoneNumber The recipient's phone number
     * @param amount The amount to transfer in smallest unit (e.g., cents)
     * @param provider The mobile money provider to use
     * @param countryCode The country code (e.g., "ke" for Kenya)
     * @return transferId The unique ID of the transfer
     */
    function initiateTransfer(
        string calldata phoneNumber,
        uint256 amount,
        ProviderType provider,
        string calldata countryCode
    ) external returns (bytes32 transferId);

    /**
     * @dev Gets the status of a transfer
     * @param transferId The unique ID of the transfer
     * @return status The status of the transfer
     */
    function getTransferStatus(bytes32 transferId) external view returns (TransferStatus status);

    /**
     * @dev Event emitted when a transfer is initiated
     */
    event TransferInitiated(
        bytes32 indexed transferId,
        address indexed sender,
        string phoneNumber,
        uint256 amount,
        ProviderType provider,
        string countryCode
    );

    /**
     * @dev Event emitted when a transfer status is updated
     */
    event TransferStatusUpdated(
        bytes32 indexed transferId,
        TransferStatus status
    );
}
