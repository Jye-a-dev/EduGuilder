import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DocumentExport } from './entities/document_export.entity';

export const ApiDocumentExports = {
  controller: () =>
    applyDecorators(ApiTags('Document Exports'), ApiBearerAuth()),

  create: () =>
    applyDecorators(
      ApiOperation({ summary: 'Register a new document export request' }),
      ApiResponse({ status: 201, type: DocumentExport }),
    ),

  findAll: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get paginated document export logs' }),
      ApiResponse({ status: 200 }),
    ),

  findOne: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get details of a document export request' }),
      ApiParam({ name: 'id', type: String }),
      ApiResponse({ status: 200, type: DocumentExport }),
    ),

  update: () =>
    applyDecorators(
      ApiOperation({ summary: 'Update status/file size of an export' }),
      ApiParam({ name: 'id', type: String }),
      ApiResponse({ status: 200, type: DocumentExport }),
    ),

  remove: () =>
    applyDecorators(
      ApiOperation({ summary: 'Delete an export record' }),
      ApiParam({ name: 'id', type: String }),
      ApiResponse({ status: 200 }),
    ),
};
