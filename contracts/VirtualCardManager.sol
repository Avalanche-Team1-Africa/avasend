// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/IERC20.sol";
import "./interfaces/IVirtualCardProvider.sol";
import "./libraries/FeeLib.sol";
import "./libraries/AccessControl.sol";

/**
 * @title VirtualCardManager
 * @dev Contract for managing virtual debit cards linked to USDC balances
 */
contract VirtualCardManager {
    using AccessControl for AccessControl.Roles;
    
    // State variables
    IERC20 public usdcToken;
    address public treasury;
    uint256 public feePercentage; // in basis points (e.g., 100 = 1%)
    AccessControl.Roles private _roles;
    
    // Mapping to track cards
    mapping(bytes32 => IVirtualCardProvider.Card) public cards;
    mapping(address => bytes32[]) public userCards;
    
    // Events
    event CardCreated(
        bytes32 indexed cardId,
        address indexed owner,
        string name,
        uint256 initialBalance
    );
    
    event CardFunded(
        bytes32 indexed cardId,
        address indexed owner,
        uint256 amount,
        uint256 newBalance
    );
    
    event CardWithdrawn(
        bytes32 indexed cardId,
        address indexed owner,
        uint256 amount,
        uint256 newBalance
    );
    
    event CardStatusUpdated(
        bytes32 indexed cardId,
        address indexed owner,
        IVirtualCardProvider.CardStatus status
    );
    
    event FeeUpdated(uint256 oldFeePercentage, uint256 newFeePercentage);
    event TreasuryUpdated(address oldTreasury, address newTreasury);
    
    /**
     * @dev Constructor
     * @param _usdcToken Address of the USDC token contract
     * @param _treasury Address where fees will be sent
     * @param _feePercentage Initial fee percentage (in basis points)
     */
    constructor(
        address _usdcToken,
        address _treasury,
        uint256 _feePercentage
    ) {
        require(_usdcToken != address(0), "VirtualCardManager: USDC token address cannot be zero");
        require(_treasury != address(0), "VirtualCardManager: Treasury address cannot be zero");
        require(_feePercentage &lt;= 1000, "VirtualCardManager: Fee percentage cannot exceed 10%");
        
        usdcToken = IERC20(_usdcToken);
        treasury = _treasury;
        feePercentage = _feePercentage;
        
        // Set deployer as admin
        _roles.grantAdminRole(msg.sender);
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
    ) external returns (bytes32 cardId) {
        require(initialBalance > 0, "VirtualCardManager: Initial balance must be greater than zero");
        require(bytes(name).length > 0, "VirtualCardManager: Card name cannot be empty");
        
        // Calculate fee
        uint256 fee = FeeLib.calculateFee(initialBalance, feePercentage);
        uint256 netAmount = initialBalance - fee;
        
        // Transfer USDC from sender to this contract
        require(
            usdcToken.transferFrom(msg.sender, address(this), initialBalance),
            "VirtualCardManager: USDC transfer failed"
        );
        
        // Transfer fee to treasury
        if (fee > 0) {
            require(
                usdcToken.transfer(treasury, fee),
                "VirtualCardManager: Fee transfer failed"
            );
        }
        
        // Generate card ID
        cardId = keccak256(
            abi.encodePacked(
                msg.sender,
                name,
                initialBalance,
                block.timestamp,
                blockhash(block.number - 1)
            )
        );
        
        // Create card record
        cards[cardId] = IVirtualCardProvider.Card({
            id: cardId,
            owner: msg.sender,
            name: name,
            balance: netAmount,
            status: IVirtualCardProvider.CardStatus.ACTIVE,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });
        
        // Add card to user's cards
        userCards[msg.sender].push(cardId);
        
        // Emit event
        emit CardCreated(
            cardId,
            msg.sender,
            name,
            netAmount
        );
        
        // In a real implementation, this would trigger an off-chain process
        // to create a virtual card via Stripe API
        
        return cardId;
    }
    
    /**
     * @dev Adds funds to an existing card
     * @param cardId The unique ID of the card
     * @param amount The amount to add to the card balance
     * @return success Whether the operation was successful
     */
    function addFunds(bytes32 cardId, uint256 amount) external returns (bool success) {
        require(amount > 0, "VirtualCardManager: Amount must be greater than zero");
        
        IVirtualCardProvider.Card storage card = cards[cardId];
        require(card.id == cardId, "VirtualCardManager: Card not found");
        require(card.owner == msg.sender, "VirtualCardManager: Not card owner");
        require(card.status == IVirtualCardProvider.CardStatus.ACTIVE, "VirtualCardManager: Card not active");
        
        // Calculate fee
        uint256 fee = FeeLib.calculateFee(amount, feePercentage);
        uint256 netAmount = amount - fee;
        
        // Transfer USDC from sender to this contract
        require(
            usdcToken.transferFrom(msg.sender, address(this), amount),
            "VirtualCardManager: USDC transfer failed"
        );
        
        // Transfer fee to treasury
        if (fee > 0) {
            require(
                usdcToken.transfer(treasury, fee),
                "VirtualCardManager: Fee transfer failed"
            );
        }
        
        // Update card balance
        card.balance += netAmount;
        card.updatedAt = block.timestamp;
        
        // Emit event
        emit CardFunded(
            cardId,
            msg.sender,
            netAmount,
            card.balance
        );
        
        // In a real implementation, this would trigger an off-chain process
        // to update the virtual card balance via Stripe API
        
        return true;
    }
    
    /**
     * @dev Withdraws funds from an existing card back to the owner
     * @param cardId The unique ID of the card
     * @param amount The amount to withdraw from the card balance
     * @return success Whether the operation was successful
     */
    function withdrawFunds(bytes32 cardId, uint256 amount) external returns (bool success) {
        require(amount > 0, "VirtualCardManager: Amount must be greater than zero");
        
        IVirtualCardProvider.Card storage card = cards[cardId];
        require(card.id == cardId, "VirtualCardManager: Card not found");
        require(card.owner == msg.sender, "VirtualCardManager: Not card owner");
        require(card.status == IVirtualCardProvider.CardStatus.ACTIVE, "VirtualCardManager: Card not active");
        require(card.balance >= amount, "VirtualCardManager: Insufficient card balance");
        
        // Update card balance
        card.balance -= amount;
        card.updatedAt = block.timestamp;
        
        // Transfer USDC back to the owner
        require(
            usdcToken.transfer(msg.sender, amount),
            "VirtualCardManager: USDC transfer failed"
        );
        
        // Emit event
        emit CardWithdrawn(
            cardId,
            msg.sender,
            amount,
            card.balance
        );
        
        // In a real implementation, this would trigger an off-chain process
        // to update the virtual card balance via Stripe API
        
        return true;
    }
    
    /**
     * @dev Updates the status of a card
     * @param cardId The unique ID of the card
     * @param status The new status to set
     * @return success Whether the operation was successful
     */
    function updateCardStatus(bytes32 cardId, IVirtualCardProvider.CardStatus status) external returns (bool success) {
        IVirtualCardProvider.Card storage card = cards[cardId];
        require(card.id == cardId, "VirtualCardManager: Card not found");
        require(card.owner == msg.sender || _roles.hasOperatorRole(msg.sender), "VirtualCardManager: Not authorized");
        
        card.status = status;
        card.updatedAt = block.timestamp;
        
        // Emit event
        emit CardStatusUpdated(
            cardId,
            card.owner,
            status
        );
        
        // In a real implementation, this would trigger an off-chain process
        // to update the virtual card status via Stripe API
        
        return true;
    }
    
    /**
     * @dev Gets information about a card
     * @param cardId The unique ID of the card
     * @return card The card information
     */
    function getCard(bytes32 cardId) external view returns (IVirtualCardProvider.Card memory) {
        IVirtualCardProvider.Card memory card = cards[cardId];
        require(card.id == cardId, "VirtualCardManager: Card not found");
        require(card.owner == msg.sender || _roles.hasOperatorRole(msg.sender), "VirtualCardManager: Not authorized");
        
        return card;
    }
    
    /**
     * @dev Gets all cards owned by the caller
     * @return cardIds Array of card IDs owned by the caller
     */
    function getUserCards() external view returns (bytes32[] memory) {
        return userCards[msg.sender];
    }
    
    /**
     * @dev Updates the fee percentage (callable only by admins)
     * @param newFeePercentage The new fee percentage (in basis points)
     */
    function updateFeePercentage(uint256 newFeePercentage) external {
        _roles.onlyAdmin();
        require(newFeePercentage &lt;= 1000, "VirtualCardManager: Fee percentage cannot exceed 10%");
        
        uint256 oldFeePercentage = feePercentage;
        feePercentage = newFeePercentage;
        
        emit FeeUpdated(oldFeePercentage, newFeePercentage);
    }
    
    /**
     * @dev Updates the treasury address (callable only by admins)
     * @param newTreasury The new treasury address
     */
    function updateTreasury(address newTreasury) external {
        _roles.onlyAdmin();
        require(newTreasury != address(0), "VirtualCardManager: Treasury address cannot be zero");
        
        address oldTreasury = treasury;
        treasury = newTreasury;
        
        emit TreasuryUpdated(oldTreasury, newTreasury);
    }
    
    /**
     * @dev Grants admin role to an account (callable only by admins)
     * @param account The account to grant the role to
     */
    function grantAdmin(address account) external {
        _roles.onlyAdmin();
        _roles.grantAdminRole(account);
    }
    
    /**
     * @dev Revokes admin role from an account (callable only by admins)
     * @param account The account to revoke the role from
     */
    function revokeAdmin(address account) external {
        _roles.onlyAdmin();
        require(account != msg.sender, "VirtualCardManager: Cannot revoke own admin role");
        _roles.revokeAdminRole(account);
    }
    
    /**
     * @dev Grants operator role to an account (callable only by admins)
     * @param account The account to grant the role to
     */
    function grantOperator(address account) external {
        _roles.onlyAdmin();
        _roles.grantOperatorRole(account);
    }
    
    /**
     * @dev Revokes operator role from an account (callable only by admins)
     * @param account The account to revoke the role from
     */
    function revokeOperator(address account) external {
        _roles.onlyAdmin();
        _roles.revokeOperatorRole(account);
    }
    
    /**
     * @dev Checks if an account has admin role
     * @param account The account to check
     * @return bool Whether the account has the role
     */
    function isAdmin(address account) external view returns (bool) {
        return _roles.hasAdminRole(account);
    }
    
    /**
     * @dev Checks if an account has operator role
     * @param account The account to check
     * @return bool Whether the account has the role
     */
    function isOperator(address account) external view returns (bool) {
        return _roles.hasOperatorRole(account);
    }
    
    /**
     * @dev Recovers any ERC20 tokens accidentally sent to the contract (callable only by admins)
     * @param token The token to recover
     * @param amount The amount to recover
     */
    function recoverERC20(address token, uint256 amount) external {
        _roles.onlyAdmin();
        IERC20(token).transfer(msg.sender, amount);
    }
}
