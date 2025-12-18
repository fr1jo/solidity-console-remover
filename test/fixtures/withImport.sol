// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenContract is ERC20 {
    constructor() ERC20("MyToken", "MTK") {
        console.log("Deploying contract");
        _mint(msg.sender, 1000000 * 10**18);
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        console.log("Transferring", amount, "to", to);
        return super.transfer(to, amount);
    }
}
