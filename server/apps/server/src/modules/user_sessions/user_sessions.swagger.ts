import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UserSession } from './entities/user_session.entity';

export const ApiUserSessions = {
  controller: () => applyDecorators(ApiTags('User Sessions')),

  create: () =>
    applyDecorators(
      ApiOperation({ summary: 'Create a new user session' }),
      ApiResponse({
        status: 201,
        description: 'Session created successfully',
        type: UserSession,
      }),
      ApiResponse({ status: 400, description: 'Invalid input' }),
      ApiResponse({ status: 404, description: 'User not found' }),
    ),

  validate: () =>
    applyDecorators(
      ApiOperation({ summary: 'Validate a session by refresh token' }),
      ApiBody({
        schema: {
          properties: {
            refresh_token: { type: 'string', example: 'refresh_token_here' },
          },
          required: ['refresh_token'],
        },
      }),
      ApiResponse({
        status: 200,
        description: 'Session is valid',
        type: UserSession,
      }),
      ApiResponse({
        status: 401,
        description: 'Invalid, revoked or expired session',
      }),
    ),

  findAll: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get list of sessions' }),
      ApiResponse({
        status: 200,
        description: 'List of user sessions with pagination metadata',
        schema: {
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/UserSession' },
            },
            total: { type: 'number', example: 12 },
          },
        },
      }),
    ),

  findOne: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get a session by ID' }),
      ApiParam({ name: 'id', type: String, description: 'Session UUID' }),
      ApiResponse({
        status: 200,
        description: 'Session found',
        type: UserSession,
      }),
      ApiResponse({ status: 404, description: 'Session not found' }),
    ),

  revoke: () =>
    applyDecorators(
      ApiOperation({ summary: 'Revoke a specific session' }),
      ApiParam({ name: 'id', type: String, description: 'Session UUID' }),
      ApiResponse({ status: 200, description: 'Session successfully revoked' }),
      ApiResponse({ status: 404, description: 'Session not found' }),
      ApiResponse({ status: 409, description: 'Session is already revoked' }),
    ),

  revokeAllForUser: () =>
    applyDecorators(
      ApiOperation({ summary: 'Revoke all sessions for a specific user' }),
      ApiParam({ name: 'userId', type: String, description: 'User UUID' }),
      ApiResponse({
        status: 200,
        description: 'Count of sessions revoked',
        schema: {
          properties: {
            revoked: { type: 'number', example: 5 },
          },
        },
      }),
      ApiResponse({ status: 404, description: 'User not found' }),
    ),

  cleanExpired: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Delete revoked or expired sessions from database',
      }),
      ApiResponse({
        status: 200,
        description: 'Number of deleted sessions',
        schema: {
          properties: {
            deleted: { type: 'number', example: 8 },
          },
        },
      }),
    ),
};
