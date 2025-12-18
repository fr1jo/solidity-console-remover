// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CleanContract {
    uint256 public counter;

    function increment() public {
        counter++;
    }

    function decrement() public {
        require(counter > 0, "Counter cannot be negative");
        counter--;
    }

    function getCounter() public view returns (uint256) {
        return counter;
    }
}
