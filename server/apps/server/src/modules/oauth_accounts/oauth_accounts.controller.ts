import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { OAuthAccountsService } from './oauth_accounts.service';
import { CreateOAuthAccountDto } from './dto/create_oauth_account.dto';
import { QueryOAuthAccountDto } from './dto/query_oauth_account.dto';
import { OAuthAccount } from './entities/oauth_account.entity';
import { ApiOAuthAccounts } from './oauth_accounts.swagger';

@Controller('oauth-accounts')
@ApiOAuthAccounts.controller()
export class OAuthAccountsController {
  constructor(private readonly oauthAccountsService: OAuthAccountsService) {}

  @Post()
  @ApiOAuthAccounts.create()
  create(@Body() createDto: CreateOAuthAccountDto): Promise<OAuthAccount> {
    return this.oauthAccountsService.create(createDto);
  }

  @Get()
  @ApiOAuthAccounts.findAll()
  findAll(
    @Query() queryDto: QueryOAuthAccountDto,
  ): Promise<{ data: OAuthAccount[]; total: number }> {
    return this.oauthAccountsService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOAuthAccounts.findOne()
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<OAuthAccount> {
    return this.oauthAccountsService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOAuthAccounts.findByUser()
  findByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<OAuthAccount[]> {
    return this.oauthAccountsService.findByUserId(userId);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOAuthAccounts.remove()
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.oauthAccountsService.remove(id);
    return {
      message: `OAuth account with ID ${id} was successfully unlinked.`,
    };
  }
}
