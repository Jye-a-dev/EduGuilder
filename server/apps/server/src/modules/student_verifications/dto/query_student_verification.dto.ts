import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VerifyStatus } from '../interfaces/student_verification.interface';

export class QueryStudentVerificationDto {
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

  @ApiPropertyOptional({ description: 'Filter by student ID' })
  @IsUUID()
  @IsOptional()
  student_id?: string;

  @ApiPropertyOptional({
    enum: VerifyStatus,
    description: 'Filter by verification status',
  })
  @IsEnum(VerifyStatus)
  @IsOptional()
  status?: VerifyStatus;

  @ApiPropertyOptional({ description: 'Filter by verifier admin ID' })
  @IsUUID()
  @IsOptional()
  verified_by?: string;

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
