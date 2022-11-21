import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ethers } from 'ethers';
import { Address } from 'cluster';
import { AppService, mintedTokens, voteHistory } from './app.service';

export class mintingDto {
  address: string;
  amount: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('token-address')
  getTokenAddress(){
    return { result: this.appService.getTokenAddress()};
  }

  @Post('request-tokens')
  async requestTokens(@Body() body: mintingDto): Promise<any> {
    return await this.appService.requestTokens(body);
  }  
  
  @Post('delegate-votes')
  delegateVotes(@Body() body) {
    return { result: this.appService.delegateVotes(body)};
  }
 
}
