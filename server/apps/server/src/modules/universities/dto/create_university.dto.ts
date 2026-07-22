import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsIn,
} from 'class-validator';

export class CreateUniversityDto {
  @ApiProperty({
    example: 'FTU',
    description: 'Unique short code of the university',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: 'Foreign Trade University',
    description: 'Name of the university',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'Miền Bắc',
    description: 'Geographic region of the university',
    enum: ['Miền Bắc', 'Miền Trung', 'Miền Nam'],
  })
  @IsString()
  @IsIn(['Miền Bắc', 'Miền Trung', 'Miền Nam'])
  @IsOptional()
  region?: string;

  @ApiPropertyOptional({
    example: 'logos/ftu_logo.png',
    description: 'Storage key for the university logo',
  })
  @IsString()
  @IsOptional()
  logo_storage_key?: string;

  @ApiPropertyOptional({
    example: '25,000,000 - 60,000,000 VND/year',
    description: 'Tuition fee details',
  })
  @IsString()
  @IsOptional()
  tuition_fees?: string;

  @ApiPropertyOptional({
    example: 'https://ftu.edu.vn',
    description: 'Official website URL',
  })
  @IsString()
  @IsOptional()
  website_url?: string;

  @ApiPropertyOptional({
    example: 'công lập',
    description: 'Type of the university',
    enum: ['công lập', 'tư thục', 'quốc tế'],
  })
  @IsString()
  @IsIn(['công lập', 'tư thục', 'quốc tế'])
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({
    example: false,
    default: false,
    description: 'Verification status of the university',
  })
  @IsBoolean()
  @IsOptional()
  is_verified?: boolean;
}
