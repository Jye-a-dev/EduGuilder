import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { UserRole } from '../interfaces/user.interface';

export class CreateUserDto {
  @ApiProperty({
    example: 'student@example.com',
    description: 'Unique user email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({
    example: 'password123',
    description: 'Raw password (will be hashed before storing)',
    minLength: 6,
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    example: 'Nguyen Van A',
    description: 'Full name of the user',
  })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiPropertyOptional({
    enum: ['admin', 'uni', 'student'],
    default: 'student',
    description: 'User system role',
  })
  @IsEnum(['admin', 'uni', 'student'] as const)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'Associated university ID',
  })
  @IsUUID()
  @IsOptional()
  university_id?: string;

  @ApiPropertyOptional({
    example: 12,
    description: 'Current grade (1-12) for student role',
    minimum: 1,
    maximum: 12,
  })
  @IsInt()
  @Min(1)
  @Max(12)
  @IsOptional()
  current_grade?: number;

  @ApiPropertyOptional({
    example: 0,
    default: 0,
    description: 'Initial eco points',
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  eco_points?: number;
}
