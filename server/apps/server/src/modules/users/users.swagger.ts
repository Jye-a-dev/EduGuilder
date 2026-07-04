import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';

export const ApiUsers = {
  controller: () => applyDecorators(ApiTags('Users')),

  create: () =>
    applyDecorators(
      ApiOperation({ summary: 'Create a new user' }),
      ApiResponse({
        status: 201,
        description: 'User created successfully',
        type: User,
      }),
      ApiResponse({ status: 400, description: 'Invalid input' }),
      ApiResponse({ status: 409, description: 'Email already exists' }),
    ),

  findAll: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get paginated list of users' }),
      ApiResponse({
        status: 200,
        description: 'List of users with pagination metadata',
        schema: {
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/User' },
            },
            total: { type: 'number', example: 100 },
          },
        },
      }),
    ),

  count: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get total count of users matching filters' }),
      ApiResponse({
        status: 200,
        description: 'Total count of matching users',
        schema: {
          type: 'object',
          properties: {
            count: { type: 'number', example: 42 },
          },
        },
      }),
    ),

  findOne: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get a user by ID' }),
      ApiParam({ name: 'id', type: String, description: 'User UUID' }),
      ApiQuery({
        name: 'relations',
        type: String,
        required: false,
        description:
          'Comma-separated list of relations to load (oauth_accounts, password_reset_tokens, user_sessions)',
      }),
      ApiResponse({ status: 200, description: 'User found', type: User }),
      ApiResponse({ status: 404, description: 'User not found' }),
    ),

  update: () =>
    applyDecorators(
      ApiOperation({ summary: 'Update an existing user' }),
      ApiParam({ name: 'id', type: String, description: 'User UUID' }),
      ApiResponse({
        status: 200,
        description: 'User updated successfully',
        type: User,
      }),
      ApiResponse({ status: 400, description: 'Invalid input' }),
      ApiResponse({ status: 404, description: 'User not found' }),
      ApiResponse({ status: 409, description: 'Email already in use' }),
    ),

  remove: () =>
    applyDecorators(
      ApiOperation({ summary: 'Delete a user (soft delete by default)' }),
      ApiParam({ name: 'id', type: String, description: 'User UUID' }),
      ApiQuery({
        name: 'hardDelete',
        type: Boolean,
        required: false,
        description: 'Perform a hard delete instead',
      }),
      ApiResponse({ status: 200, description: 'User deleted successfully' }),
      ApiResponse({ status: 404, description: 'User not found' }),
    ),

  restore: () =>
    applyDecorators(
      ApiOperation({ summary: 'Restore a soft-deleted user' }),
      ApiParam({ name: 'id', type: String, description: 'User UUID' }),
      ApiResponse({ status: 200, description: 'User restored successfully' }),
      ApiResponse({ status: 404, description: 'User not found' }),
      ApiResponse({
        status: 409,
        description: 'User is not deleted or could not be restored',
      }),
    ),
};
