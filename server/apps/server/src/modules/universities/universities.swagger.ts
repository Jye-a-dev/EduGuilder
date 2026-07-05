import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { University } from './entities/university.entity';

export const ApiUniversities = {
  controller: () => applyDecorators(ApiTags('Universities')),

  create: () =>
    applyDecorators(
      ApiOperation({ summary: 'Create a new university' }),
      ApiResponse({
        status: 201,
        description: 'University created successfully',
        type: University,
      }),
      ApiResponse({ status: 400, description: 'Invalid input' }),
      ApiResponse({ status: 409, description: 'Code already exists' }),
    ),

  findAll: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get paginated list of universities' }),
      ApiResponse({
        status: 200,
        description: 'List of universities with pagination metadata',
        schema: {
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/University' },
            },
            total: { type: 'number', example: 50 },
          },
        },
      }),
    ),

  count: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get total count of universities matching filters',
      }),
      ApiResponse({
        status: 200,
        description: 'Total count of matching universities',
        schema: {
          type: 'object',
          properties: {
            count: { type: 'number', example: 12 },
          },
        },
      }),
    ),

  findOne: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get a university by ID' }),
      ApiParam({ name: 'id', type: String, description: 'University UUID' }),
      ApiResponse({
        status: 200,
        description: 'University found',
        type: University,
      }),
      ApiResponse({ status: 404, description: 'University not found' }),
    ),

  update: () =>
    applyDecorators(
      ApiOperation({ summary: 'Update an existing university' }),
      ApiParam({ name: 'id', type: String, description: 'University UUID' }),
      ApiResponse({
        status: 200,
        description: 'University updated successfully',
        type: University,
      }),
      ApiResponse({ status: 400, description: 'Invalid input' }),
      ApiResponse({ status: 404, description: 'University not found' }),
      ApiResponse({ status: 409, description: 'Code already in use' }),
    ),

  remove: () =>
    applyDecorators(
      ApiOperation({ summary: 'Delete a university (soft delete by default)' }),
      ApiParam({ name: 'id', type: String, description: 'University UUID' }),
      ApiQuery({
        name: 'hardDelete',
        type: Boolean,
        required: false,
        description: 'Perform a hard delete instead',
      }),
      ApiResponse({
        status: 200,
        description: 'University deleted successfully',
      }),
      ApiResponse({ status: 404, description: 'University not found' }),
    ),

  restore: () =>
    applyDecorators(
      ApiOperation({ summary: 'Restore a soft-deleted university' }),
      ApiParam({ name: 'id', type: String, description: 'University UUID' }),
      ApiResponse({
        status: 200,
        description: 'University restored successfully',
      }),
      ApiResponse({ status: 404, description: 'University not found' }),
      ApiResponse({
        status: 409,
        description: 'University is not deleted or could not be restored',
      }),
    ),
};
