// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract SendMoney  {
    address private owner;
    
    uint256 timestamp = block.timestamp;
    uint256 Locked_time = timestamp + 86400;


    uint public balanceReceived;
    event balance (uint256 balance);

  function Admin() private { owner = msg.sender; }
function LockedTime () public view returns(uint256){
    return Locked_time;
    
    // return timestamp;
}
//    function abc1() override public { 
//        abc();


// }




    function receiveMoney() public payable {
        balanceReceived += msg.value;
        emit balance(msg.value);

    }

    function getBalance() public view returns(uint256) {
        return address(this).balance;
    }
    
    function withdrawMoney() public {
        // require(timestamp == Locked_time , "Amount is locked  " );
        require(msg.sender  == owner , "you are not owner");
        address payable to = payable(msg.sender);
        to.transfer(getBalance());
        emit balance (getBalance());
    }
}