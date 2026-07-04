import { applyDecorators } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OAuthAccount } from './entities/oauth_account.entity';

export const ApiOAuthAccounts = {
  controller: () => applyDecorators(ApiTags('OAuth Accounts')),

  create: () =>
    applyDecorators(
      ApiOperation({ summary: 'Link an OAuth account to a user' }),
      ApiResponse({
        status: 201,
        description: 'OAuth account linked successfully',
        type: OAuthAccount,
      }),
      ApiResponse({ status: 400, description: 'Invalid input' }),
      ApiResponse({ status: 404, description: 'User not found' }),
      ApiResponse({
        status: 409,
        description: 'OAuth provider already linked',
      }),
    ),

  findAll: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get paginated list of OAuth accounts' }),
      ApiResponse({
        status: 200,
        description: 'List of OAuth accounts with pagination metadata',
        schema: {
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/OAuthAccount' },
            },
            total: { type: 'number', example: 5 },
          },
        },
      }),
    ),

  findOne: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get an OAuth account by ID' }),
      ApiParam({ name: 'id', type: String, description: 'OAuth Account UUID' }),
      ApiResponse({
        status: 200,
        description: 'OAuth account found',
        type: OAuthAccount,
      }),
      ApiResponse({ status: 404, description: 'OAuth account not found' }),
    ),

  findByUser: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get OAuth accounts linked to a specific user' }),
      ApiParam({ name: 'userId', type: String, description: 'User UUID' }),
      ApiResponse({
        status: 200,
        description: 'List of OAuth accounts linked to the user',
        type: [OAuthAccount],
      }),
      ApiResponse({ status: 404, description: 'User not found' }),
    ),

  remove: () =>
    applyDecorators(
      ApiOperation({ summary: 'Unlink/delete an OAuth account' }),
      ApiParam({ name: 'id', type: String, description: 'OAuth Account UUID' }),
      ApiResponse({
        status: 200,
        description: 'OAuth account successfully unlinked',
      }),
      ApiResponse({ status: 404, description: 'OAuth account not found' }),
    ),
};
