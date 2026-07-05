import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NoteLink {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  source_note_id: string;

  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  target_note_id: string;

  @ApiProperty({ example: '2026-07-05T09:27:25Z' })
  created_at: Date;
}

export class Tag {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @ApiProperty({ example: 'javascript' })
  name: string;
}

export class NoteTable {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  note_id: string;

  @ApiProperty({ example: 0 })
  table_index: number;

  @ApiProperty({ example: ['Header 1', 'Header 2'] })
  headers: any;

  @ApiProperty({ example: [['Row 1 Col 1', 'Row 1 Col 2']] })
  rows: any;

  @ApiProperty({ example: '2026-07-05T09:27:25Z' })
  created_at: Date;
}

export class NoteSlide {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  note_id: string;

  @ApiProperty({ example: 0 })
  slide_index: number;

  @ApiProperty({
    example: 'content',
    enum: ['title', 'content', 'split_column', 'thank_you'],
  })
  slide_type: 'title' | 'content' | 'split_column' | 'thank_you';

  @ApiPropertyOptional({ example: 'Slide Title' })
  title?: string;

  @ApiPropertyOptional({ example: ['Bullet Point 1', 'Bullet Point 2'] })
  bullet_points?: any;

  @ApiPropertyOptional({ example: '#ffffff' })
  background_color?: string;

  @ApiProperty({ example: '2026-07-05T09:27:25Z' })
  created_at: Date;
}

export class Note {
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Note ID',
  })
  id: string;

  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Student User ID',
  })
  student_id: string;

  @ApiProperty({ example: 'NestJS Tutorial', description: 'Note title' })
  title: string;

  @ApiProperty({
    example: '# Markdown content',
    description: 'Note markdown content',
  })
  content: string;

  @ApiPropertyOptional({ description: 'Deleted timestamp for soft delete' })
  deleted_at?: Date;

  @ApiProperty({ example: '2026-07-05T09:27:25Z' })
  created_at: Date;

  @ApiProperty({ example: '2026-07-05T09:27:25Z' })
  updated_at: Date;

  // Relations
  @ApiPropertyOptional({ type: () => [Tag] })
  tags?: Tag[];

  @ApiPropertyOptional({ type: () => [NoteTable] })
  tables?: NoteTable[];

  @ApiPropertyOptional({ type: () => [NoteSlide] })
  slides?: NoteSlide[];
}
