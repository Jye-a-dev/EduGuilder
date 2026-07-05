import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Note, NoteLink, NoteTable, NoteSlide } from './entities/note.entity';

export const ApiNotes = {
  controller: () => applyDecorators(ApiTags('Notes'), ApiBearerAuth()),

  create: () =>
    applyDecorators(
      ApiOperation({ summary: 'Create a new note with optional tags' }),
      ApiResponse({ status: 201, type: Note }),
    ),

  findAll: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get paginated list of notes' }),
      ApiResponse({ status: 200 }),
    ),

  count: () =>
    applyDecorators(
      ApiOperation({ summary: 'Count notes matching criteria' }),
      ApiResponse({ status: 200 }),
    ),

  findOne: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get note detail including tags, tables, and slides',
      }),
      ApiParam({ name: 'id', type: String }),
      ApiResponse({ status: 200, type: Note }),
    ),

  update: () =>
    applyDecorators(
      ApiOperation({ summary: 'Update note details and tags' }),
      ApiParam({ name: 'id', type: String }),
      ApiResponse({ status: 200, type: Note }),
    ),

  remove: () =>
    applyDecorators(
      ApiOperation({ summary: 'Soft/Hard delete a note' }),
      ApiParam({ name: 'id', type: String }),
      ApiQuery({ name: 'hardDelete', type: Boolean, required: false }),
      ApiResponse({ status: 200 }),
    ),

  restore: () =>
    applyDecorators(
      ApiOperation({ summary: 'Restore a soft-deleted note' }),
      ApiParam({ name: 'id', type: String }),
      ApiResponse({ status: 200 }),
    ),

  link: () =>
    applyDecorators(
      ApiOperation({ summary: 'Link two notes together' }),
      ApiParam({ name: 'id', type: String, description: 'Source Note ID' }),
      ApiResponse({ status: 201, type: NoteLink }),
    ),

  unlink: () =>
    applyDecorators(
      ApiOperation({ summary: 'Unlink two notes' }),
      ApiParam({ name: 'id', type: String, description: 'Source Note ID' }),
      ApiParam({
        name: 'targetId',
        type: String,
        description: 'Target Note ID',
      }),
      ApiResponse({ status: 200 }),
    ),

  getLinks: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get all notes linked from this note' }),
      ApiParam({ name: 'id', type: String }),
      ApiResponse({ status: 200, type: [Note] }),
    ),

  addTable: () =>
    applyDecorators(
      ApiOperation({ summary: 'Add a tabular block to note' }),
      ApiParam({ name: 'id', type: String }),
      ApiResponse({ status: 201, type: NoteTable }),
    ),

  clearTables: () =>
    applyDecorators(
      ApiOperation({ summary: 'Remove all tabular blocks of a note' }),
      ApiParam({ name: 'id', type: String }),
      ApiResponse({ status: 200 }),
    ),

  addSlide: () =>
    applyDecorators(
      ApiOperation({ summary: 'Add a slide configuration to note' }),
      ApiParam({ name: 'id', type: String }),
      ApiResponse({ status: 201, type: NoteSlide }),
    ),

  clearSlides: () =>
    applyDecorators(
      ApiOperation({ summary: 'Remove all slides of a note' }),
      ApiParam({ name: 'id', type: String }),
      ApiResponse({ status: 200 }),
    ),
};
