import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsInt,
  IsNumber,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

export class CreateUniversityAdmissionDto {
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Associated university ID',
  })
  @IsUUID()
  @IsNotEmpty()
  university_id: string;

  @ApiProperty({
    example: 2024,
    description: 'Admission year',
  })
  @IsInt()
  @Min(1900)
  @Max(2100)
  @IsNotEmpty()
  year: number;

  @ApiProperty({
    example: '7340101',
    description: 'Major code',
  })
  @IsString()
  @IsNotEmpty()
  major_code: string;

  @ApiProperty({
    example: 'Business Administration',
    description: 'Name of the major',
  })
  @IsString()
  @IsNotEmpty()
  major_name: string;

  @ApiPropertyOptional({
    example: 150,
    default: 0,
    description: 'Admission quota for the major',
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  quota?: number;

  @ApiProperty({
    example: 27.5,
    description: 'Benchmark/cutoff score for admission',
  })
  @IsNumber()
  @Min(0)
  @Max(40)
  @IsNotEmpty()
  benchmark_score: number;

  @ApiProperty({
    example: 'A00',
    description: 'Subject group code (e.g. A00, A01, D01)',
  })
  @IsString()
  @IsNotEmpty()
  group_code: string;
}
