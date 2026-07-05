import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { PasswordResetTokensService } from './password_reset_tokens.service';
import { QueryPasswordResetTokenDto } from './dto/query_password_reset_token.dto';
import { PasswordResetToken } from './entities/password_reset_token.entity';
import { ApiPasswordResetTokens } from './password_reset_tokens.swagger';

@Controller('password_reset_tokens')
@ApiPasswordResetTokens.controller()
export class PasswordResetTokensController {
  constructor(private readonly service: PasswordResetTokensService) {}

  @Post('generate')
  @ApiPasswordResetTokens.generate()
  generate(
    @Body('user_id', ParseUUIDPipe) userId: string,
  ): Promise<{ token: string; record: PasswordResetToken }> {
    return this.service.generateToken(userId);
  }

  @Post('validate')
  @HttpCode(200)
  @ApiPasswordResetTokens.validate()
  validate(@Body('token') token: string): Promise<PasswordResetToken> {
    return this.service.validateToken(token);
  }

  @Post('use')
  @HttpCode(200)
  @ApiPasswordResetTokens.use()
  use(@Body('token') token: string): Promise<PasswordResetToken> {
    return this.service.useToken(token);
  }

  @Get()
  @ApiPasswordResetTokens.findAll()
  findAll(
    @Query() queryDto: QueryPasswordResetTokenDto,
  ): Promise<{ data: PasswordResetToken[]; total: number }> {
    return this.service.findAll(queryDto);
  }

  @Get(':id')
  @ApiPasswordResetTokens.findOne()
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PasswordResetToken> {
    return this.service.findOne(id);
  }

  @Post('clean-expired')
  @HttpCode(200)
  @ApiPasswordResetTokens.cleanExpired()
  cleanExpired(): Promise<{ deleted: number }> {
    return this.service.cleanExpired();
  }
}
