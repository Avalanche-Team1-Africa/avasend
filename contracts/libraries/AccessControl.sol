// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AccessControl
 * @dev Library for handling access control in contracts
 */
library AccessControl {
    struct Roles {
        mapping(address => bool) admins;
        mapping(address => bool) operators;
    }

    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    /**
     * @dev Grants admin role to an account
     * @param roles The roles storage
     * @param account The account to grant the role to
     */
    function grantAdminRole(Roles storage roles, address account) internal {
        roles.admins[account] = true;
        emit RoleGranted(ADMIN_ROLE, account, msg.sender);
    }

    /**
     * @dev Revokes admin role from an account
     * @param roles The roles storage
     * @param account The account to revoke the role from
     */
    function revokeAdminRole(Roles storage roles, address account) internal {
        roles.admins[account] = false;
        emit RoleRevoked(ADMIN_ROLE, account, msg.sender);
    }

    /**
     * @dev Grants operator role to an account
     * @param roles The roles storage
     * @param account The account to grant the role to
     */
    function grantOperatorRole(Roles storage roles, address account) internal {
        roles.operators[account] = true;
        emit RoleGranted(OPERATOR_ROLE, account, msg.sender);
    }

    /**
     * @dev Revokes operator role from an account
     * @param roles The roles storage
     * @param account The account to revoke the role from
     */
    function revokeOperatorRole(Roles storage roles, address account) internal {
        roles.operators[account] = false;
        emit RoleRevoked(OPERATOR_ROLE, account, msg.sender);
    }

    /**
     * @dev Checks if an account has admin role
     * @param roles The roles storage
     * @param account The account to check
     * @return bool Whether the account has the role
     */
    function hasAdminRole(Roles storage roles, address account) internal view returns (bool) {
        return roles.admins[account];
    }

    /**
     * @dev Checks if an account has operator role
     * @param roles The roles storage
     * @param account The account to check
     * @return bool Whether the account has the role
     */
    function hasOperatorRole(Roles storage roles, address account) internal view returns (bool) {
        return roles.operators[account] || roles.admins[account]; // Admins also have operator privileges
    }

    /**
     * @dev Modifier to make a function callable only by admins
     * @param roles The roles storage
     */
    function onlyAdmin(Roles storage roles) internal view {
        require(hasAdminRole(roles, msg.sender), "AccessControl: caller is not an admin");
    }

    /**
     * @dev Modifier to make a function callable only by operators
     * @param roles The roles storage
     */
    function onlyOperator(Roles storage roles) internal view {
        require(hasOperatorRole(roles, msg.sender), "AccessControl: caller is not an operator");
    }
}
