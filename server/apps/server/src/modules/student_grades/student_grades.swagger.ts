import { applyDecorators } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { StudentGrade } from './entities/student_grade.entity';

export const ApiStudentGrades = {
  controller: () => applyDecorators(ApiTags('Student Grades')),

  create: () =>
    applyDecorators(
      ApiOperation({ summary: 'Create a new student grade record' }),
      ApiResponse({
        status: 201,
        description: 'Grade record created successfully',
        type: StudentGrade,
      }),
      ApiResponse({ status: 400, description: 'Invalid input' }),
      ApiResponse({ status: 404, description: 'Student not found' }),
      ApiResponse({ status: 409, description: 'Duplicate record exists' }),
    ),

  findAll: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get paginated list of student grade records' }),
      ApiResponse({
        status: 200,
        description: 'List of grade records with pagination metadata',
        schema: {
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/StudentGrade' },
            },
            total: { type: 'number', example: 100 },
          },
        },
      }),
    ),

  count: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get total count of grade records matching filters',
      }),
      ApiResponse({
        status: 200,
        description: 'Total count of matching grade records',
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
      ApiOperation({ summary: 'Get a grade record by ID' }),
      ApiParam({
        name: 'id',
        type: String,
        description: 'Grade record UUID',
      }),
      ApiResponse({
        status: 200,
        description: 'Record found',
        type: StudentGrade,
      }),
      ApiResponse({ status: 404, description: 'Record not found' }),
    ),

  update: () =>
    applyDecorators(
      ApiOperation({ summary: 'Update an existing grade record' }),
      ApiParam({
        name: 'id',
        type: String,
        description: 'Grade record UUID',
      }),
      ApiResponse({
        status: 200,
        description: 'Record updated successfully',
        type: StudentGrade,
      }),
      ApiResponse({ status: 400, description: 'Invalid input' }),
      ApiResponse({ status: 404, description: 'Record or Student not found' }),
      ApiResponse({
        status: 409,
        description: 'Duplicate record details already in use',
      }),
    ),

  remove: () =>
    applyDecorators(
      ApiOperation({ summary: 'Delete a grade record' }),
      ApiParam({
        name: 'id',
        type: String,
        description: 'Grade record UUID',
      }),
      ApiResponse({ status: 200, description: 'Record deleted successfully' }),
      ApiResponse({ status: 404, description: 'Record not found' }),
    ),
};
