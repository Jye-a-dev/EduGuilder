import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateNoteDto {
  @ApiPropertyOptional({ example: 'Updated NestJS Tutorial' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: '# Updated Markdown content' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ example: ['nestjs', 'backend', 'v10'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
