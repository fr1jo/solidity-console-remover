// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract SimpleContract {
    uint256 public value;

    function setValue(uint256 _value) public {
        console.log("Setting value to:", _value);
        value = _value;
        console.log("Value set successfully");
    }

    function getValue() public view returns (uint256) {
        return value;
    }
}
