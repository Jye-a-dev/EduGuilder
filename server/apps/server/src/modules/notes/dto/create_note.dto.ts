import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Student User ID',
  })
  @IsUUID()
  @IsNotEmpty()
  student_id: string;

  @ApiProperty({ example: 'NestJS Tutorial', description: 'Note title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '# Markdown content',
    description: 'Note markdown content',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    example: ['nestjs', 'backend'],
    description: 'Tags to attach',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
