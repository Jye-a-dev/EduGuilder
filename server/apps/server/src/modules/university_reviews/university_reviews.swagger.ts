import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UniversityReview } from './entities/university_review.entity';

export const ApiUniversityReviews = {
  controller: () =>
    applyDecorators(ApiTags('University Reviews'), ApiBearerAuth()),

  create: () =>
    applyDecorators(
      ApiOperation({ summary: 'Write a new review for a university' }),
      ApiResponse({ status: 201, type: UniversityReview }),
    ),

  findAll: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get reviews with filters' }),
      ApiResponse({ status: 200 }),
    ),

  findOne: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get a single review detail' }),
      ApiParam({ name: 'id', type: String }),
      ApiResponse({ status: 200, type: UniversityReview }),
    ),

  update: () =>
    applyDecorators(
      ApiOperation({ summary: 'Update a review or add reply/approval' }),
      ApiParam({ name: 'id', type: String }),
      ApiResponse({ status: 200, type: UniversityReview }),
    ),

  remove: () =>
    applyDecorators(
      ApiOperation({ summary: 'Soft or hard delete a review' }),
      ApiParam({ name: 'id', type: String }),
      ApiQuery({ name: 'hardDelete', type: Boolean, required: false }),
      ApiResponse({ status: 200 }),
    ),

  restore: () =>
    applyDecorators(
      ApiOperation({ summary: 'Restore a deleted review' }),
      ApiParam({ name: 'id', type: String }),
      ApiResponse({ status: 200 }),
    ),
};
