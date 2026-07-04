import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';
import { QueryUserDto } from './dto/query_user.dto';
import { ApiUsers } from './users.swagger';
import { User } from './entities/user.entity';

@Controller('users')
@ApiUsers.controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiUsers.create()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiUsers.findAll()
  findAll(
    @Query() queryDto: QueryUserDto,
  ): Promise<{ data: User[]; total: number }> {
    return this.usersService.findAll(queryDto);
  }

  @Get('count')
  @ApiUsers.count()
  async count(@Query() queryDto: QueryUserDto): Promise<{ count: number }> {
    const countFilters = { ...queryDto };
    delete countFilters.page;
    delete countFilters.limit;
    const total = await this.usersService.count(countFilters);
    return { count: total };
  }

  @Get(':id')
  @ApiUsers.findOne()
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('relations') relations?: string,
  ): Promise<User> {
    const relationsList = relations ? relations.split(',') : [];
    const rels = {
      oauth: relationsList.includes('oauth_accounts'),
      tokens: relationsList.includes('password_reset_tokens'),
      sessions: relationsList.includes('user_sessions'),
    };
    return this.usersService.findOne(id, rels);
  }

  @Patch(':id')
  @ApiUsers.update()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiUsers.remove()
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('hardDelete') hardDelete?: string,
  ): Promise<{ message: string }> {
    const shouldHardDelete = hardDelete === 'true';
    await this.usersService.remove(id, shouldHardDelete);
    return {
      message: `User with ID ${id} was successfully ${
        shouldHardDelete ? 'hard' : 'soft'
      } deleted.`,
    };
  }

  @Post(':id/restore')
  @HttpCode(200)
  @ApiUsers.restore()
  async restore(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.usersService.restore(id);
    return { message: `User with ID ${id} was successfully restored.` };
  }
}
