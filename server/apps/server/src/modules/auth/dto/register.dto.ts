import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsUUID,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'student@example.com', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Nguyen Van A', description: 'User full name' })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiPropertyOptional({
    example: 'student',
    enum: ['student', 'uni', 'admin'],
    description: 'User role',
  })
  @IsEnum(['student', 'uni', 'admin'])
  @IsOptional()
  role?: 'student' | 'uni' | 'admin';

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Associated university ID',
  })
  @IsUUID()
  @IsOptional()
  university_id?: string;

  @ApiPropertyOptional({
    example: 12,
    description: 'Current school grade (1-12)',
  })
  @IsInt()
  @Min(1)
  @Max(12)
  @IsOptional()
  current_grade?: number;
}
