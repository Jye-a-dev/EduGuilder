import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { UserRole } from '../interfaces/user.interface';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'student@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: 'newpassword123',
    description: 'New password (will be hashed if updated)',
    minLength: 6,
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    example: 'Nguyen Van A',
    description: 'Full name of the user',
  })
  @IsString()
  @IsOptional()
  full_name?: string;

  @ApiPropertyOptional({
    enum: ['admin', 'uni', 'student'],
    description: 'User system role',
  })
  @IsEnum(['admin', 'uni', 'student'] as const)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'Associated university ID',
    nullable: true,
  })
  @IsUUID()
  @IsOptional()
  university_id?: string | null;

  @ApiPropertyOptional({
    example: 12,
    description: 'Current grade (1-12) for student role',
    minimum: 1,
    maximum: 12,
    nullable: true,
  })
  @IsInt()
  @Min(1)
  @Max(12)
  @IsOptional()
  current_grade?: number | null;

  @ApiPropertyOptional({ example: 100, description: 'Eco points' })
  @IsInt()
  @Min(0)
  @IsOptional()
  eco_points?: number;
}
