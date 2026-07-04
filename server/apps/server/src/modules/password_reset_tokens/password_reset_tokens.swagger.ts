import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PasswordResetToken } from './entities/password_reset_token.entity';

export const ApiPasswordResetTokens = {
  controller: () => applyDecorators(ApiTags('Password Reset Tokens')),

  generate: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Generate a new password reset token for a user',
      }),
      ApiBody({
        schema: {
          properties: {
            user_id: {
              type: 'string',
              format: 'uuid',
              description: 'User UUID',
            },
          },
          required: ['user_id'],
        },
      }),
      ApiResponse({
        status: 201,
        description: 'Token generated successfully',
        schema: {
          properties: {
            token: { type: 'string', example: 'a1b2c3d4e5...' },
            record: { $ref: '#/components/schemas/PasswordResetToken' },
          },
        },
      }),
      ApiResponse({ status: 404, description: 'User not found' }),
    ),

  validate: () =>
    applyDecorators(
      ApiOperation({
        summary:
          'Validate a reset token (check if valid, not expired, not used)',
      }),
      ApiBody({
        schema: {
          properties: {
            token: { type: 'string', example: 'a1b2c3d4e5...' },
          },
          required: ['token'],
        },
      }),
      ApiResponse({
        status: 200,
        description: 'Token is valid',
        type: PasswordResetToken,
      }),
      ApiResponse({
        status: 400,
        description: 'Token expired or already used',
      }),
      ApiResponse({ status: 404, description: 'Token not found' }),
    ),

  use: () =>
    applyDecorators(
      ApiOperation({ summary: 'Mark token as used' }),
      ApiBody({
        schema: {
          properties: {
            token: { type: 'string', example: 'a1b2c3d4e5...' },
          },
          required: ['token'],
        },
      }),
      ApiResponse({
        status: 200,
        description: 'Token successfully marked as used',
        type: PasswordResetToken,
      }),
      ApiResponse({
        status: 400,
        description: 'Token expired or already used',
      }),
      ApiResponse({ status: 404, description: 'Token not found' }),
    ),

  findAll: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get list of password reset tokens' }),
      ApiResponse({
        status: 200,
        description: 'List of tokens with pagination metadata',
        schema: {
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/PasswordResetToken' },
            },
            total: { type: 'number', example: 10 },
          },
        },
      }),
    ),

  findOne: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get a password reset token by ID' }),
      ApiParam({ name: 'id', type: String, description: 'Token UUID' }),
      ApiResponse({
        status: 200,
        description: 'Token found',
        type: PasswordResetToken,
      }),
      ApiResponse({ status: 404, description: 'Token not found' }),
    ),

  cleanExpired: () =>
    applyDecorators(
      ApiOperation({ summary: 'Clean up all expired reset tokens' }),
      ApiResponse({
        status: 200,
        description: 'Number of deleted expired tokens',
        schema: {
          properties: {
            deleted: { type: 'number', example: 3 },
          },
        },
      }),
    ),
};
