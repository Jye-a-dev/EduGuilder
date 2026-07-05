import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsString,
  IsOptional,
  IsInt,
  IsObject,
} from 'class-validator';

export class CreateDocumentExportDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @IsUUID()
  @IsNotEmpty()
  student_id: string;

  @ApiPropertyOptional({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @IsUUID()
  @IsOptional()
  source_note_id?: string;

  @ApiProperty({ example: 'pdf', enum: ['pdf', 'word', 'excel', 'ppt'] })
  @IsEnum(['pdf', 'word', 'excel', 'ppt'])
  format: 'pdf' | 'word' | 'excel' | 'ppt';

  @ApiProperty({ example: 'exports/notes/nestjs-notes-12345.pdf' })
  @IsString()
  @IsNotEmpty()
  storage_key: string;

  @ApiPropertyOptional({ example: 1048576 })
  @IsInt()
  @IsOptional()
  file_size_bytes?: number;

  @ApiPropertyOptional({
    example: 'completed',
    enum: ['pending', 'processing', 'completed', 'failed'],
  })
  @IsEnum(['pending', 'processing', 'completed', 'failed'])
  @IsOptional()
  status?: 'pending' | 'processing' | 'completed' | 'failed' = 'completed';

  @ApiPropertyOptional({ example: { theme: 'light', page_size: 'A4' } })
  @IsObject()
  @IsOptional()
  render_settings?: any;
}
