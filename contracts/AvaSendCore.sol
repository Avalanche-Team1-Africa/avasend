// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/IERC20.sol";
import "./interfaces/IMobileMoneyProvider.sol";
import "./libraries/FeeLib.sol";
import "./libraries/AccessControl.sol";

/**
 * @title AvaSendCore
 * @dev Main contract for the AvaSend platform that handles USDC transfers and mobile money integration
 */
contract AvaSendCore {
    using AccessControl for AccessControl.Roles;
    
    // State variables
    IERC20 public usdcToken;
    address public treasury;
    uint256 public feePercentage; // in basis points (e.g., 100 = 1%)
    AccessControl.Roles private _roles;
    
    // Mapping to track transfers
    mapping(bytes32 => IMobileMoneyProvider.Transfer) public transfers;
    
    // Events
    event TransferInitiated(
        bytes32 indexed transferId,
        address indexed sender,
        string phoneNumber,
        uint256 amount,
        IMobileMoneyProvider.ProviderType provider,
        string countryCode
    );
    
    event TransferCompleted(
        bytes32 indexed transferId,
        address indexed sender,
        string phoneNumber,
        uint256 amount
    );
    
    event TransferFailed(
        bytes32 indexed transferId,
        address indexed sender,
        string phoneNumber,
        uint256 amount,
        string reason
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
        require(_usdcToken != address(0), "AvaSendCore: USDC token address cannot be zero");
        require(_treasury != address(0), "AvaSendCore: Treasury address cannot be zero");
        require(_feePercentage &lt;= 1000, "AvaSendCore: Fee percentage cannot exceed 10%");
        
        usdcToken = IERC20(_usdcToken);
        treasury = _treasury;
        feePercentage = _feePercentage;
        
        // Set deployer as admin
        _roles.grantAdminRole(msg.sender);
    }
    
    /**
     * @dev Sends USDC to a mobile money wallet
     * @param phoneNumber The recipient's phone number
     * @param amount The amount to send in USDC (with 6 decimals)
     * @param provider The mobile money provider to use
     * @param countryCode The country code (e.g., "ke" for Kenya)
     * @return transferId The unique ID of the transfer
     */
    function sendToMobileWallet(
        string calldata phoneNumber,
        uint256 amount,
        IMobileMoneyProvider.ProviderType provider,
        string calldata countryCode
    ) external returns (bytes32 transferId) {
        require(amount > 0, "AvaSendCore: Amount must be greater than zero");
        require(bytes(phoneNumber).length > 0, "AvaSendCore: Phone number cannot be empty");
        require(bytes(countryCode).length > 0, "AvaSendCore: Country code cannot be empty");
        
        // Calculate fee
        uint256 fee = FeeLib.calculateFee(amount, feePercentage);
        uint256 netAmount = amount - fee;
        
        // Transfer USDC from sender to this contract
        require(
            usdcToken.transferFrom(msg.sender, address(this), amount),
            "AvaSendCore: USDC transfer failed"
        );
        
        // Transfer fee to treasury
        if (fee > 0) {
            require(
                usdcToken.transfer(treasury, fee),
                "AvaSendCore: Fee transfer failed"
            );
        }
        
        // Generate transfer ID
        transferId = keccak256(
            abi.encodePacked(
                msg.sender,
                phoneNumber,
                amount,
                block.timestamp,
                blockhash(block.number - 1)
            )
        );
        
        // Create transfer record
        transfers[transferId] = IMobileMoneyProvider.Transfer({
            id: transferId,
            sender: msg.sender,
            phoneNumber: phoneNumber,
            amount: netAmount,
            provider: provider,
            countryCode: countryCode,
            status: IMobileMoneyProvider.TransferStatus.PENDING,
            timestamp: block.timestamp
        });
        
        // Emit event
        emit TransferInitiated(
            transferId,
            msg.sender,
            phoneNumber,
            netAmount,
            provider,
            countryCode
        );
        
        // In a real implementation, this would trigger an off-chain process
        // to initiate the mobile money transfer via IntaSend API
        
        return transferId;
    }
    
    /**
     * @dev Updates the status of a transfer (callable only by operators)
     * @param transferId The unique ID of the transfer
     * @param status The new status of the transfer
     * @param reason Optional reason for failure (if status is FAILED)
     */
    function updateTransferStatus(
        bytes32 transferId,
        IMobileMoneyProvider.TransferStatus status,
        string calldata reason
    ) external {
        _roles.onlyOperator();
        
        IMobileMoneyProvider.Transfer storage transfer = transfers[transferId];
        require(transfer.id == transferId, "AvaSendCore: Transfer not found");
        require(transfer.status == IMobileMoneyProvider.TransferStatus.PENDING, "AvaSendCore: Transfer already processed");
        
        transfer.status = status;
        
        if (status == IMobileMoneyProvider.TransferStatus.COMPLETED) {
            emit TransferCompleted(
                transferId,
                transfer.sender,
                transfer.phoneNumber,
                transfer.amount
            );
        } else if (status == IMobileMoneyProvider.TransferStatus.FAILED) {
            // Refund the sender (minus the fee which is already taken)
            require(
                usdcToken.transfer(transfer.sender, transfer.amount),
                "AvaSendCore: Refund failed"
            );
            
            emit TransferFailed(
                transferId,
                transfer.sender,
                transfer.phoneNumber,
                transfer.amount,
                reason
            );
        }
    }
    
    /**
     * @dev Gets information about a transfer
     * @param transferId The unique ID of the transfer
     * @return transfer The transfer information
     */
    function getTransfer(bytes32 transferId) external view returns (IMobileMoneyProvider.Transfer memory) {
        return transfers[transferId];
    }
    
    /**
     * @dev Updates the fee percentage (callable only by admins)
     * @param newFeePercentage The new fee percentage (in basis points)
     */
    function updateFeePercentage(uint256 newFeePercentage) external {
        _roles.onlyAdmin();
        require(newFeePercentage &lt;= 1000, "AvaSendCore: Fee percentage cannot exceed 10%");
        
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
        require(newTreasury != address(0), "AvaSendCore: Treasury address cannot be zero");
        
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
        require(account != msg.sender, "AvaSendCore: Cannot revoke own admin role");
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
