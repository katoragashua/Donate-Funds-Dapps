// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

error UserNotFound(address user);

contract Donation {
    uint public totalAmount;
    address owner;
    mapping(address => uint) public userBalance;

    constructor() {
        owner = msg.sender;
    }

    function onlyOwner() private view {
        require(owner == msg.sender, "Only owner can withdraw");
    }

    function donate(uint _amount) external {
        require(_amount > 0, "Zero Value not allowed");
        userBalance[msg.sender] += _amount;
        totalAmount += _amount;
    }

    function getUserBalances(address _user) external view returns (uint) {
        uint balance = userBalance[_user];
        if (balance == 0 && _user != address(0)) {
            revert UserNotFound(_user);
        }
        return balance;
    }

    function getTotalBalance() external view returns(uint) {
        return totalAmount;
    }

    function withdraw() external payable {
        onlyOwner();
        require(totalAmount > 0, "No funds available to withdraw");
        userBalance[owner] = totalAmount;
        totalAmount = 0;
    }

}