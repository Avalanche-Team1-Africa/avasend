// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title FeeLib
 * @dev Library for calculating fees and handling currency conversions
 */
library FeeLib {
    /**
     * @dev Calculates the fee amount based on a percentage
     * @param amount The amount to calculate the fee from
     * @param feePercentage The fee percentage (in basis points, e.g., 100 = 1%)
     * @return fee The calculated fee amount
     */
    function calculateFee(uint256 amount, uint256 feePercentage) internal pure returns (uint256 fee) {
        return (amount * feePercentage) / 10000;
    }

    /**
     * @dev Calculates the amount after deducting the fee
     * @param amount The original amount
     * @param feePercentage The fee percentage (in basis points, e.g., 100 = 1%)
     * @return netAmount The amount after fee deduction
     */
    function calculateNetAmount(uint256 amount, uint256 feePercentage) internal pure returns (uint256 netAmount) {
        uint256 fee = calculateFee(amount, feePercentage);
        return amount - fee;
    }
}
