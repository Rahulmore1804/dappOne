// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Funder {
    uint public numOfFunder ;

    mapping(uint =>address) private funders;
    receive() external payable{}
    function transfer() external payable {
        funders[numOfFunder] = msg.sender;
    }

    function withDraw (uint withAmout) external{
        require(withAmout <=2000000000000000000,"can not more than 2");
     payable(msg.sender).transfer(withAmout);
    }
}