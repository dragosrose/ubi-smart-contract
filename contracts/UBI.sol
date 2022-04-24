//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract UBI {
    event EmitSubscriptions(bool enable);
    event EmitClaimable(bool enable);

    
    address[] private subscribers;
    mapping(address => uint) private subscribersIndexed;
    mapping(address => uint) private subscribersClaim;
    uint index;

    address private owner;
    address private cron;

    // check if subs/claims are enabled
    bool private subEnable;
    // bool private claimEnable;

    // track the passed time
    uint private timePassed;

    uint private dailyIncome;

    constructor(address _cron) {
        subEnable = false;
        // claimEnable = false;

        index = 0;
        dailyIncome = 0;
        owner = msg.sender;
        cron = _cron;

        timePassed = 0 minutes;
    }

    function donate() public payable returns (string memory) {
        require(msg.value > 0);
        return string(abi.encodePacked("Thank you for your donation, ", msg.sender));

    }

    function enableSubscriptionsToChains() public onlyOwner {
        emit EmitSubscriptions(true);
    }

    function disableSubscriptionsToChains() public onlyOwner {
        emit EmitSubscriptions(false);
    }

    // function enableClaimableToChains() public onlyCron {
    //     emit EmitClaimable(true);
    // }


    
    function enableSubscription() public onlyCron {
        // require(address(this).balance > 0, "Not enough balance to distribute.");
        require(!subEnable, "Subscriptions already enabled.");

        subEnable = true;
    }

    function disableSubscription() public onlyCron {
        require(subEnable, "Subscriptions are not enabled.");
        require(timePassed >= 5 minutes, "Not enough time has passed");

        subEnable = false;
        
    }

    // It executes every x amount of time since subscriptions have been enabled.
    function checkIncomes() public onlyCron {
        require(subEnable, "Subscriptions are not enabled.");
        dailyIncome = address(this).balance - dailyIncome;
        for(uint i = 0; i < subscribers.length; i++){
            subscribersClaim[subscribers[i]] += dailyIncome;
        }

        // Cron is legit no need for checking block time trust me bro
        timePassed += 1 minutes;
    }


    // Will do later some sort of struct/array to enable claimings by each individual subscription.
    // At the moment will leave it to just globally letting subscribers claim tokens.
    function claimTokens() public {
        require(exists(msg.sender) != 0, "Address not subscribed in the first place.");
        require(!subEnable, "Subscriptions are not disabled.");
        (bool success, ) = msg.sender.call{value: subscribersClaim[msg.sender]}("");
        require(success, "Error claiming token.");
    }
    
    function getSubscription() public {
        require(exists(msg.sender) == 0, "Address already subscribed.");
        
        subscribers.push(msg.sender);
        subscribersIndexed[msg.sender] = index + 1;
    }

    // Tot ajungem sa cautam printre subscriberi

    function stopSubscription(uint _index) public {
        require(exists(msg.sender) != 0, "Address not subscribed in the first place.");

        subscribers[_index] = subscribers[subscribers.length - 1];
        subscribers.pop();

        subscribersIndexed[msg.sender] = 0;

    }


    function exists(address item) private view returns (uint) {
        return subscribersIndexed[item];
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyCron() {
        require(msg.sender == cron);
        _;
    }
}
