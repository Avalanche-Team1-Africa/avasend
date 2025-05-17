// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./AvaSendCore.sol";
import "./VirtualCardManager.sol";
import "./libraries/AccessControl.sol";

/**
 * @title AvaSendFactory
 * @dev Factory contract for deploying new instances of AvaSend
 */
contract AvaSendFactory {
    using AccessControl for AccessControl.Roles;
    
    // State variables
    AccessControl.Roles private _roles;
    
    // Deployed contracts
    address[] public deployedCores;
    address[] public deployedCardManagers;
    
    // Events
    event CoreDeployed(address indexed coreAddress, address indexed deployer);
    event CardManagerDeployed(address indexed cardManagerAddress, address indexed deployer);
    
    /**
     * @dev Constructor
     */
    constructor() {
        // Set deployer as admin
        _roles.grantAdminRole(msg.sender);
    }
    
    /**
     * @dev Deploys a new AvaSendCore contract
     * @param usdcToken Address of the USDC token contract
     * @param treasury Address where fees will be sent
     * @param feePercentage Initial fee percentage (in basis points)
     * @return coreAddress Address of the deployed contract
     */
    function deployCore(
        address usdcToken,
        address treasury,
        uint256 feePercentage
    ) external returns (address coreAddress) {
        _roles.onlyAdmin();
        
        AvaSendCore core = new AvaSendCore(
            usdcToken,
            treasury,
            feePercentage
        );
        
        coreAddress = address(core);
        deployedCores.push(coreAddress);
        
        emit CoreDeployed(coreAddress, msg.sender);
        
        return coreAddress;
    }
    
    /**
     * @dev Deploys a new VirtualCardManager contract
     * @param usdcToken Address of the USDC token contract
     * @param treasury Address where fees will be sent
     * @param feePercentage Initial fee percentage (in basis points)
     * @return cardManagerAddress Address of the deployed contract
     */
    function deployCardManager(
        address usdcToken,
        address treasury,
        uint256 feePercentage
    ) external returns (address cardManagerAddress) {
        _roles.onlyAdmin();
        
        VirtualCardManager cardManager = new VirtualCardManager(
            usdcToken,
            treasury,
            feePercentage
        );
        
        cardManagerAddress = address(cardManager);
        deployedCardManagers.push(cardManagerAddress);
        
        emit CardManagerDeployed(cardManagerAddress, msg.sender);
        
        return cardManagerAddress;
    }
    
    /**
     * @dev Gets all deployed AvaSendCore contracts
     * @return Array of deployed contract addresses
     */
    function getDeployedCores() external view returns (address[] memory) {
        return deployedCores;
    }
    
    /**
     * @dev Gets all deployed VirtualCardManager contracts
     * @return Array of deployed contract addresses
     */
    function getDeployedCardManagers() external view returns (address[] memory) {
        return deployedCardManagers;
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
        require(account != msg.sender, "AvaSendFactory: Cannot revoke own admin role");
        _roles.revokeAdminRole(account);
    }
    
    /**
     * @dev Checks if an account has admin role
     * @param account The account to check
     * @return bool Whether the account has the role
     */
    function isAdmin(address account) external view returns (bool) {
        return _roles.hasAdminRole(account);
    }
}
