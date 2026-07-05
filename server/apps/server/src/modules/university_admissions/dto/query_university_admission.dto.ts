import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  IsEnum,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryUniversityAdmissionDto {
  @ApiPropertyOptional({
    default: 1,
    description: 'Page number for pagination',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, description: 'Number of items per page' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search term for matching major code or name',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by associated university ID' })
  @IsUUID()
  @IsOptional()
  university_id?: string;

  @ApiPropertyOptional({ description: 'Filter by admission year' })
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @IsOptional()
  year?: number;

  @ApiPropertyOptional({
    description: 'Filter by subject group code (e.g. A00, A01)',
  })
  @IsString()
  @IsOptional()
  group_code?: string;

  @ApiPropertyOptional({ description: 'Minimum benchmark score' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  minScore?: number;

  @ApiPropertyOptional({ description: 'Maximum benchmark score' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  maxScore?: number;

  @ApiPropertyOptional({
    default: 'created_at',
    description: 'Field name to sort by',
  })
  @IsString()
  @IsOptional()
  sortBy?: string = 'created_at';

  @ApiPropertyOptional({
    enum: ['ASC', 'DESC'],
    default: 'DESC',
    description: 'Sorting order',
  })
  @IsEnum(['ASC', 'DESC'] as const)
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
