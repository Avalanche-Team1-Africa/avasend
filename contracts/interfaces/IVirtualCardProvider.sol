// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title IVirtualCardProvider
 * @dev Interface for virtual card providers like Stripe
 * This is an abstract representation as the actual integration will happen off-chain
 * through oracles or API calls.
 */
interface IVirtualCardProvider {
    /**
     * @dev Enum representing the status of a virtual card
     */
    enum CardStatus {
        ACTIVE,
        INACTIVE,
        FROZEN,
        EXPIRED
    }

    /**
     * @dev Struct representing a virtual card
     */
    struct Card {
        bytes32 id;
        address owner;
        string name;
        uint256 balance;
        CardStatus status;
        uint256 createdAt;
        uint256 updatedAt;
    }

    /**
     * @dev Creates a new virtual card
     * @param name The name to display on the card
     * @param initialBalance The initial balance to load onto the card
     * @return cardId The unique ID of the created card
     */
    function createCard(
        string calldata name,
        uint256 initialBalance
    ) external returns (bytes32 cardId);

    /**
     * @dev Adds funds to an existing card
     * @param cardId The unique ID of the card
     * @param amount The amount to add to the card balance
     * @return success Whether the operation was successful
     */
    function addFunds(bytes32 cardId, uint256 amount) external returns (bool success);

    /**
     * @dev Withdraws funds from an existing card back to the owner
     * @param cardId The unique ID of the card
     * @param amount The amount to withdraw from the card balance
     * @return success Whether the operation was successful
     */
    function withdrawFunds(bytes32 cardId, uint256 amount) external returns (bool success);

    /**
     * @dev Updates the status of a card
     * @param cardId The unique ID of the card
     * @param status The new status to set
     * @return success Whether the operation was successful
     */
    function updateCardStatus(bytes32 cardId, CardStatus status) external returns (bool success);

    /**
     * @dev Gets information about a card
     * @param cardId The unique ID of the card
     * @return card The card information
     */
    function getCard(bytes32 cardId) external view returns (Card memory card);

    /**
     * @dev Event emitted when a new card is created
     */
    event CardCreated(
        bytes32 indexed cardId,
        address indexed owner,
        string name,
        uint256 initialBalance
    );

    /**
     * @dev Event emitted when funds are added to a card
     */
    event FundsAdded(
        bytes32 indexed cardId,
        uint256 amount,
        uint256 newBalance
    );

    /**
     * @dev Event emitted when funds are withdrawn from a card
     */
    event FundsWithdrawn(
        bytes32 indexed cardId,
        uint256 amount,
        uint256 newBalance
    );

    /**
     * @dev Event emitted when a card's status is updated
     */
    event CardStatusUpdated(
        bytes32 indexed cardId,
        CardStatus status
    );
}
