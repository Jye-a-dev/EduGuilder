import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsInt,
  IsEnum,
  Min,
} from 'class-validator';

export class LinkNoteDto {
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Target Note ID to link to',
  })
  @IsUUID()
  @IsNotEmpty()
  target_note_id: string;
}

export class CreateNoteTableDto {
  @ApiProperty({ example: 0, description: 'Table order index' })
  @IsInt()
  @Min(0)
  table_index: number;

  @ApiProperty({
    example: ['Header A', 'Header B'],
    description: 'Headers array',
  })
  @IsNotEmpty()
  headers: any;

  @ApiProperty({
    example: [
      ['Cell A1', 'Cell B1'],
      ['Cell A2', 'Cell B2'],
    ],
    description: 'Rows matrix',
  })
  @IsNotEmpty()
  rows: any;
}

export class CreateNoteSlideDto {
  @ApiProperty({ example: 0, description: 'Slide order index' })
  @IsInt()
  @Min(0)
  slide_index: number;

  @ApiProperty({
    example: 'content',
    enum: ['title', 'content', 'split_column', 'thank_you'],
  })
  @IsEnum(['title', 'content', 'split_column', 'thank_you'])
  slide_type: 'title' | 'content' | 'split_column' | 'thank_you';

  @ApiPropertyOptional({ example: 'My Slide Title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: ['Point 1', 'Point 2'] })
  @IsOptional()
  bullet_points?: any;

  @ApiPropertyOptional({ example: '#ffffff' })
  @IsString()
  @IsOptional()
  background_color?: string;
}
