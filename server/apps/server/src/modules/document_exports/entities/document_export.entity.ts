import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DocumentExport {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  student_id: string;

  @ApiPropertyOptional({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  source_note_id?: string;

  @ApiProperty({ example: 'pdf', enum: ['pdf', 'word', 'excel', 'ppt'] })
  format: 'pdf' | 'word' | 'excel' | 'ppt';

  @ApiProperty({ example: 'exports/notes/nestjs-notes-12345.pdf' })
  storage_key: string;

  @ApiPropertyOptional({ example: 1048576, description: 'File size in bytes' })
  file_size_bytes?: number;

  @ApiProperty({
    example: 'completed',
    enum: ['pending', 'processing', 'completed', 'failed'],
  })
  status: 'pending' | 'processing' | 'completed' | 'failed';

  @ApiPropertyOptional({ example: { theme: 'light', page_size: 'A4' } })
  render_settings?: any;

  @ApiProperty({ example: '2026-07-05T09:27:25Z' })
  created_at: Date;
}
