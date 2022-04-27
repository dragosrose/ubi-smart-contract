const { expect } = require ("chai");
const { parseEther } = require ("ethers/lib/utils");
const { ethers } = require ("hardhat");

describe("UBI", function(){

  let provider, ubi;
  let owner, cron, addr1, addr2, addr3;

  beforeEach(async() => {
    [owner, cron, addr1, addr2, addr3] = await ethers.getSigners();

    provider = ethers.provider;
    const UBI = await ethers.getContractFactory("UBI");
    ubi = await UBI.deploy(cron.address);
    await ubi.deployed();


  });


  it(" has donations working.", async() => {
    await ubi.connect(addr1).donate({value: parseEther("0.1")});
    await ubi.connect(addr2).donate({value: parseEther("0.1")});
  });


  it(" enables subscriptions.", async() => {
    await ubi.connect(cron).enableSubscription();

  });

  it(" can subscribe.", async() => {
    await ubi.connect(cron).getSubscription(addr1.address);
    await ubi.connect(cron).getSubscription(addr2.address);
    await ubi.connect(cron).getSubscription(addr3.address);
  });

  it(" can stop subscribing", async () => {
    await ubi.connect(cron).getSubscription(addr1.address);
    await ubi.connect(cron).stopSubscription(addr1.address);
    await ubi.connect(cron).getSubscription(addr2.address);
    await ubi.connect(cron).getSubscription(addr1.address);
    await ubi.connect(cron).stopSubscription(addr1.address);
  });

  it(" can check incomes", async () => {
    await ubi.connect(addr1).donate({value: parseEther("0.1")});
    await ubi.connect(addr2).donate({value: parseEther("0.1")});
    await ubi.connect(cron).enableSubscription();
    await ubi.connect(cron).getSubscription(addr1.address);
    await ubi.connect(cron).getSubscription(addr2.address);

    await ubi.connect(cron).checkIncomes();
    
    
  });


  it(" can claim tokens", async () => {
    await ubi.connect(addr1).donate({value: parseEther("0.1")});
    await ubi.connect(addr2).donate({value: parseEther("0.1")});
    await ubi.connect(cron).enableSubscription();
    await ubi.connect(cron).getSubscription(addr1.address);
    await ubi.connect(cron).getSubscription(addr2.address);
    

    await ubi.connect(cron).checkIncomes();
    await ubi.connect(cron).checkIncomes();
    await ubi.connect(addr2).donate({value: parseEther("0.1")});
    console.log(await provider.getBalance(ubi.address));
    await ubi.connect(cron).getSubscription(addr3.address);
    await ubi.connect(cron).checkIncomes();
    await ubi.connect(cron).checkIncomes();
    await ubi.connect(addr2).donate({value: parseEther("0.1")});
    await ubi.connect(cron).checkIncomes();

    await ubi.connect(cron).disableSubscription();

    console.log(await provider.getBalance(ubi.address));

    await ubi.connect(addr1).claimTokens();
    await ubi.connect(addr2).claimTokens();
    await ubi.connect(addr3).claimTokens();



  })



  
});