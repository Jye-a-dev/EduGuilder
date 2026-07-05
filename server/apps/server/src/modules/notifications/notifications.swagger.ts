import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Notification } from './entities/notification.entity';

export const ApiNotifications = {
  controller: () => applyDecorators(ApiTags('Notifications'), ApiBearerAuth()),

  create: () =>
    applyDecorators(
      ApiOperation({ summary: 'Create a new system/user notification' }),
      ApiResponse({ status: 201, type: Notification }),
    ),

  findAll: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get paginated notifications' }),
      ApiResponse({ status: 200 }),
    ),

  findOne: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get details of a notification' }),
      ApiParam({ name: 'id', type: String }),
      ApiResponse({ status: 200, type: Notification }),
    ),

  markAsRead: () =>
    applyDecorators(
      ApiOperation({ summary: 'Mark a notification as read' }),
      ApiParam({ name: 'id', type: String }),
      ApiResponse({ status: 200 }),
    ),

  markAllAsRead: () =>
    applyDecorators(
      ApiOperation({ summary: 'Mark all user notifications as read' }),
      ApiQuery({ name: 'user_id', type: String, required: true }),
      ApiResponse({ status: 200 }),
    ),

  remove: () =>
    applyDecorators(
      ApiOperation({ summary: 'Delete a notification' }),
      ApiParam({ name: 'id', type: String }),
      ApiResponse({ status: 200 }),
    ),
};
