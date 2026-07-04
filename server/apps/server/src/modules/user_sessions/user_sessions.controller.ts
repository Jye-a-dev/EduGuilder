import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { UserSessionsService } from './user_sessions.service';
import { CreateUserSessionDto } from './dto/create_user_session.dto';
import { QueryUserSessionDto } from './dto/query_user_session.dto';
import { UserSession } from './entities/user_session.entity';
import { ApiUserSessions } from './user_sessions.swagger';

@Controller('user-sessions')
@ApiUserSessions.controller()
export class UserSessionsController {
  constructor(private readonly service: UserSessionsService) {}

  @Post()
  @ApiUserSessions.create()
  create(@Body() createDto: CreateUserSessionDto): Promise<UserSession> {
    return this.service.create(createDto);
  }

  @Post('validate')
  @HttpCode(200)
  @ApiUserSessions.validate()
  validate(@Body('refresh_token') refreshToken: string): Promise<UserSession> {
    return this.service.validate(refreshToken);
  }

  @Get()
  @ApiUserSessions.findAll()
  findAll(
    @Query() queryDto: QueryUserSessionDto,
  ): Promise<{ data: UserSession[]; total: number }> {
    return this.service.findAll(queryDto);
  }

  @Get(':id')
  @ApiUserSessions.findOne()
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserSession> {
    return this.service.findOne(id);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiUserSessions.revoke()
  async revoke(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.service.revoke(id);
    return { message: `Session with ID ${id} was successfully revoked.` };
  }

  @Delete('user/:userId')
  @HttpCode(200)
  @ApiUserSessions.revokeAllForUser()
  revokeAllForUser(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<{ revoked: number }> {
    return this.service.revokeAllForUser(userId);
  }

  @Post('clean-expired')
  @HttpCode(200)
  @ApiUserSessions.cleanExpired()
  cleanExpired(): Promise<{ deleted: number }> {
    return this.service.cleanExpired();
  }
}
