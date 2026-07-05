import { applyDecorators } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UniversityAdmission } from './entities/university_admission.entity';

export const ApiUniversityAdmissions = {
  controller: () => applyDecorators(ApiTags('University Admissions')),

  create: () =>
    applyDecorators(
      ApiOperation({ summary: 'Create a new university admission record' }),
      ApiResponse({
        status: 201,
        description: 'Admission record created successfully',
        type: UniversityAdmission,
      }),
      ApiResponse({ status: 400, description: 'Invalid input' }),
      ApiResponse({ status: 404, description: 'University not found' }),
      ApiResponse({ status: 409, description: 'Duplicate record exists' }),
    ),

  findAll: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get paginated list of university admission records',
      }),
      ApiResponse({
        status: 200,
        description: 'List of admission records with pagination metadata',
        schema: {
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/UniversityAdmission' },
            },
            total: { type: 'number', example: 100 },
          },
        },
      }),
    ),

  count: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get total count of admission records matching filters',
      }),
      ApiResponse({
        status: 200,
        description: 'Total count of matching admission records',
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
      ApiOperation({ summary: 'Get an admission record by ID' }),
      ApiParam({
        name: 'id',
        type: String,
        description: 'Admission record UUID',
      }),
      ApiResponse({
        status: 200,
        description: 'Record found',
        type: UniversityAdmission,
      }),
      ApiResponse({ status: 404, description: 'Record not found' }),
    ),

  update: () =>
    applyDecorators(
      ApiOperation({ summary: 'Update an existing admission record' }),
      ApiParam({
        name: 'id',
        type: String,
        description: 'Admission record UUID',
      }),
      ApiResponse({
        status: 200,
        description: 'Record updated successfully',
        type: UniversityAdmission,
      }),
      ApiResponse({ status: 400, description: 'Invalid input' }),
      ApiResponse({
        status: 404,
        description: 'Record or University not found',
      }),
      ApiResponse({
        status: 409,
        description: 'Duplicate record details already in use',
      }),
    ),

  remove: () =>
    applyDecorators(
      ApiOperation({ summary: 'Delete an admission record' }),
      ApiParam({
        name: 'id',
        type: String,
        description: 'Admission record UUID',
      }),
      ApiResponse({ status: 200, description: 'Record deleted successfully' }),
      ApiResponse({ status: 404, description: 'Record not found' }),
    ),
};
