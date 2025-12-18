// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract MultilineContract {
    function complexFunction(uint256 a, uint256 b) public {
        console.log("Starting calculation");
        uint256 result = a + b;
        console.log("Result:", result);

        console.logInt(int256(result));
        console.logUint(result);
        console.logAddress(msg.sender);

        if (result > 100) {
            console.log("Result is greater than 100");
        }
    }
}
