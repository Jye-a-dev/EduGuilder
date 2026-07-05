import { applyDecorators } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { StudentVerification } from './entities/student_verification.entity';

export const ApiStudentVerifications = {
  controller: () => applyDecorators(ApiTags('Student Verifications')),

  create: () =>
    applyDecorators(
      ApiOperation({ summary: 'Create a new student verification request' }),
      ApiResponse({
        status: 201,
        description: 'Verification request created successfully',
        type: StudentVerification,
      }),
      ApiResponse({ status: 400, description: 'Invalid input' }),
      ApiResponse({ status: 404, description: 'Student not found' }),
    ),

  findAll: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get paginated list of student verification requests',
      }),
      ApiResponse({
        status: 200,
        description: 'List of verification requests with pagination metadata',
        schema: {
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/StudentVerification' },
            },
            total: { type: 'number', example: 100 },
          },
        },
      }),
    ),

  count: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get total count of verification requests matching filters',
      }),
      ApiResponse({
        status: 200,
        description: 'Total count of matching verification requests',
        schema: {
          type: 'object',
          properties: {
            count: { type: 'number', example: 24 },
          },
        },
      }),
    ),

  findOne: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get a verification request by ID' }),
      ApiParam({
        name: 'id',
        type: String,
        description: 'Verification request UUID',
      }),
      ApiResponse({
        status: 200,
        description: 'Verification request found',
        type: StudentVerification,
      }),
      ApiResponse({
        status: 404,
        description: 'Verification request not found',
      }),
    ),

  update: () =>
    applyDecorators(
      ApiOperation({ summary: 'Update an existing verification request' }),
      ApiParam({
        name: 'id',
        type: String,
        description: 'Verification request UUID',
      }),
      ApiResponse({
        status: 200,
        description: 'Verification request updated successfully',
        type: StudentVerification,
      }),
      ApiResponse({ status: 400, description: 'Invalid input' }),
      ApiResponse({
        status: 404,
        description: 'Verification request, Student or Verifier not found',
      }),
    ),

  remove: () =>
    applyDecorators(
      ApiOperation({ summary: 'Delete a verification request' }),
      ApiParam({
        name: 'id',
        type: String,
        description: 'Verification request UUID',
      }),
      ApiResponse({ status: 200, description: 'Request deleted successfully' }),
      ApiResponse({
        status: 404,
        description: 'Verification request not found',
      }),
    ),
};
