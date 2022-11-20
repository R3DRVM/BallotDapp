import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ethers } from 'ethers';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('token-address')
  getTokenAddress(){
    return { result: this.appService.getTokenAddress()};
  }

  @Post('request-tokens')
  requestTokens(@Body() body) {
    return { result: this.appService.requestTokens(body)};
  }
  
  @Post('delegate-votes')
  delegateVotes(@Body() body) {
    return { result: this.appService.delegateVotes(body)};
  }
 
}
