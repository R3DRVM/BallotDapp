import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json';

const tokenAddress = "0x350e655770e02e05B4f22169A7b8d3d5aAd6B46a";
const MINT_VALUE = ethers.utils.parseEther("10");


@Injectable()
export class AppService {
  provider: ethers.providers.BaseProvider;
  erc20Contract: ethers.Contract;
  signerAddress;
  signer;


  constructor() {
    this.provider = ethers.getDefaultProvider('goerli', {alchemy: process.env.ALCHEMY_API_KEY});
    const erc20ContractFactory = new ethers.ContractFactory(
      tokenJson.abi,
      tokenJson.bytecode,
    );
    this.erc20Contract = erc20ContractFactory.attach(tokenAddress);
    const signer = ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
    this.signer = this.signerAddress.connect(this.provider);
  }
 
  getTokenAddress() {
    return tokenAddress;
  }

  async requestTokens(body: any) {
    console.log(`Minting tokens to ${body.address}`)
    const mint = await this.erc20Contract.connect(this.signer).mint(body.address, MINT_VALUE);
    await mint.wait();
    console.log(`Success, tx hash is: ${mint.hash}`)
    //Minting
    //await tx
    //return tx hash
  }
  async delegateVotes(body: any) {
    console.log('Delegating votes...');
    const delegate = await this.erc20Contract.delegate(body.address);
    await delegate.wait();
    console.log(`Delegation successful, Tx Hash: ${delegate.hash}`);
    return delegate.hash;
  }
 }
