import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsInt,
  IsNumber,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

export class UpdateUniversityAdmissionDto {
  @ApiPropertyOptional({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Associated university ID',
  })
  @IsUUID()
  @IsOptional()
  university_id?: string;

  @ApiPropertyOptional({
    example: 2024,
    description: 'Admission year',
  })
  @IsInt()
  @Min(1900)
  @Max(2100)
  @IsOptional()
  year?: number;

  @ApiPropertyOptional({
    example: '7340101',
    description: 'Major code',
  })
  @IsString()
  @IsOptional()
  major_code?: string;

  @ApiPropertyOptional({
    example: 'Business Administration',
    description: 'Name of the major',
  })
  @IsString()
  @IsOptional()
  major_name?: string;

  @ApiPropertyOptional({
    example: 150,
    description: 'Admission quota for the major',
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  quota?: number;

  @ApiPropertyOptional({
    example: 27.5,
    description: 'Benchmark/cutoff score for admission',
  })
  @IsNumber()
  @Min(0)
  @Max(40)
  @IsOptional()
  benchmark_score?: number;

  @ApiPropertyOptional({
    example: 'A00',
    description: 'Subject group code (e.g. A00, A01, D01)',
  })
  @IsString()
  @IsOptional()
  group_code?: string;
}
