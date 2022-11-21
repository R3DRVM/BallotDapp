import { Injectable } from '@nestjs/common';
import { Address } from 'cluster';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json';
import * as ballotJson from './assets/TokenizedBallot.json';
import * as dotenv from "dotenv";
import { mintingDto } from './app.controller';

export class mintedTokens {
  mintToAddress: Address;
  tokenAmount: number;
}

export class tokensDelegated {
  receiver: Address;
}

export class voteHistory {
  proposalId: string;
  voteAmount: string; 
}

const tokenAddress = "0x350e655770e02e05B4f22169A7b8d3d5aAd6B46a";
const ballotAddress = "0xf185087be41f7ae83690998f97c8c512b3a55f00";
const MINT_VALUE = ethers.utils.parseEther("10");


@Injectable()
export class AppService {

  provider: ethers.providers.AlchemyProvider;
  erc20ContractFactory: ethers.ContractFactory;
  erc20Contract: ethers.Contract;
  ballotContractFactory: ethers.ContractFactory;
  ballotContract: ethers.Contract;
  proposals: string[] | undefined;


  constructor() {
    //provider
    this.provider =  new ethers.providers.AlchemyProvider('goerli', process.env.ALCHEMY_API_KEY ?? "");
    const erc20ContractFactory = new ethers.ContractFactory(
      tokenJson.abi,
      tokenJson.bytecode,
    );
    const Wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
    const signer = Wallet.connect(this.provider);
    this.erc20Contract = erc20ContractFactory.attach(tokenAddress).connect(this.provider);

    this.ballotContractFactory= new ethers.ContractFactory(ballotJson.abi, ballotJson.bytecode);
    this.ballotContract = this.ballotContractFactory.attach(ballotAddress).connect(this.provider);

  }

  getProposals() {
    return this.proposals;
  }
 
  getTokenAddress() {
    return tokenAddress;
  }

  async requestTokens(body: mintingDto) {
    //minting
    const minterWallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC);
    const minter = minterWallet.connect(this.provider);
    const mintingStart = this.erc20ContractFactory.attach(tokenAddress).connect(minter);
    console.log(`Minting tokens to ${minter.address}`);
    const mintAmount = ethers.utils.parseEther(body.amount);
    const mintTx = await this.erc20Contract.mint(body.address, mintAmount);
    await mintTx.wait();
    console.log(`Successfully minted tokens, tx hash is: ${mintTx.hash}`);
    const txHash: string = mintTx.hash;
    return txHash;
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
