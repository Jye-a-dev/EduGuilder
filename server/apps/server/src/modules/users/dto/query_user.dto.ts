import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  IsEnum,
  IsUUID,
  IsBoolean,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { UserRole } from '../interfaces/user.interface';

export class QueryUserDto {
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
    description: 'Search term for matching user email or full name',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: UserRole, description: 'Filter by user role' })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({ description: 'Filter by university ID' })
  @IsUUID()
  @IsOptional()
  university_id?: string;

  @ApiPropertyOptional({
    default: false,
    description: 'Whether to include soft-deleted users in results',
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  includeDeleted?: boolean = false;

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
