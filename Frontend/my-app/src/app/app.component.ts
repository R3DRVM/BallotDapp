import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BigNumber, ethers } from 'ethers';
import tokenJson from '../assets/MyToken.json';
//import ballotJson from '../assets/ballotJson';

const tokenAddress = "0x350e655770e02e05B4f22169A7b8d3d5aAd6B46a";
const ballotAddress = "0xf185087be41f7ae83690998f97c8c512b3a55f00";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  wallet: ethers.Wallet | undefined;
  provider: ethers.providers.BaseProvider | undefined;
  
  tokenContractAddress: string | undefined;
  ballotContractAddress: string | undefined;

  etherBalance: number | undefined;
  tokenBalance: number |undefined;
  votePower: number | undefined;
  tokenContract: ethers.Contract | undefined;
  ballotContract: ethers.Contract | undefined

  constructor(private http: HttpClient) {
  
  }

  createWallet() {
    this.provider = ethers.providers.getDefaultProvider("goerli");
    this.wallet = ethers.Wallet.createRandom().connect(this.provider);
      this.http.
        get<any>("http://localhost:3000/token-address")
        .subscribe((ans) => {
      console.log(ans);
      this.tokenContractAddress = ans.result;
    //  this.http.
    //  get<any>("http://localhost:3000/token-address")
    //  .subscribe((ans) => {
    //   console.log(ans);
    this.ballotContractAddress = ans.result;
      this.updateBlockchainInfo();
      setInterval(this.updateBlockchainInfo, 1000);
    });

  }

  private updateBlockchainInfo() {
    if (this.tokenContractAddress && this.wallet) {
      this.tokenContract = new ethers.Contract(
        this.tokenContractAddress,
        tokenJson.abi,
        this.wallet);
      this.wallet.getBalance().then((balanceBn) => {
        this.etherBalance = parseFloat(ethers.utils.formatEther(balanceBn));
      });
      this.tokenContract["balanceOf"](this.wallet.address).then(
        (tokenBalanceBn: BigNumber) => {
          this.tokenBalance = parseFloat(
            ethers.utils.formatEther(tokenBalanceBn)
          );
        }
      );
      this.tokenContract["getVotes"](this.wallet.address).then(
        (votePowerBn: BigNumber) => {
          this.votePower = parseFloat(
            ethers.utils.formatEther(votePowerBn)
          );
        });
    }
  }

  vote(voteId: string){
    console.log("Trying to vote for " + voteId);
    // to do -> this.ballotContract["vote"](voteId)
  }

  request() {
    console.log("minting to" + this.wallet?.address);
    this.http
        .post<any>("http://localhost:3000/request-tokens", {address: this.wallet?.address})
        .subscribe((ans) => {
          console.log(ans);
        });    
  }

}

