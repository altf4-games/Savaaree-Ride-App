// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

contract RideSharing {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    receive() external payable  {}

    function withdraw() public {
        require(msg.sender == owner, "Only the owner can withdraw funds");
        payable(owner).transfer(address(this).balance);
    }
}