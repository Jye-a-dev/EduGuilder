import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FileNode } from './entities/file_node.entity';

export const ApiFileNodes = {
  controller: () => applyDecorators(ApiTags('File Nodes'), ApiBearerAuth()),

  create: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Create a folder or note link in the tree sidebar',
      }),
      ApiResponse({ status: 201, type: FileNode }),
    ),

  findAll: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get direct child nodes based on query filters',
      }),
      ApiResponse({ status: 200, type: [FileNode] }),
    ),

  findOne: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get a single file node detail' }),
      ApiParam({ name: 'id', type: String }),
      ApiResponse({ status: 200, type: FileNode }),
    ),

  update: () =>
    applyDecorators(
      ApiOperation({ summary: 'Update/Rename a file node' }),
      ApiParam({ name: 'id', type: String }),
      ApiResponse({ status: 200, type: FileNode }),
    ),

  remove: () =>
    applyDecorators(
      ApiOperation({ summary: 'Delete a file node recursively' }),
      ApiParam({ name: 'id', type: String }),
      ApiResponse({ status: 200 }),
    ),

  getTree: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get the full recursive tree for a student sidebar',
      }),
      ApiQuery({ name: 'student_id', type: String, required: true }),
      ApiResponse({ status: 200, type: [FileNode] }),
    ),
};
