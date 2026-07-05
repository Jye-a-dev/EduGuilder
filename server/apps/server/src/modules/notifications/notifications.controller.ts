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
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create_notification.dto';
import { QueryNotificationDto } from './dto/query_notification.dto';
import { ApiNotifications } from './notifications.swagger';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('notifications')
@UseGuards(AuthGuard)
@ApiNotifications.controller()
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Post()
  @ApiNotifications.create()
  create(@Body() createDto: CreateNotificationDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiNotifications.findAll()
  findAll(@Query() queryDto: QueryNotificationDto) {
    return this.service.findAll(queryDto);
  }

  @Post('mark-all-read')
  @HttpCode(200)
  @ApiNotifications.markAllAsRead()
  markAllAsRead(@Query('user_id', ParseUUIDPipe) userId: string) {
    return this.service.markAllAsRead(userId);
  }

  @Get(':id')
  @ApiNotifications.findOne()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id/read')
  @HttpCode(200)
  @ApiNotifications.markAsRead()
  async markAsRead(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.markAsRead(id);
    return { message: `Notification with ID ${id} was marked as read.` };
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiNotifications.remove()
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.remove(id);
    return { message: `Notification with ID ${id} was successfully deleted.` };
  }
}
