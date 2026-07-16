import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsIn } from 'class-validator';

export class UpdateUniversityDto {
  @ApiPropertyOptional({
    example: 'FTU',
    description: 'Unique short code of the university',
  })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({
    example: 'Foreign Trade University',
    description: 'Name of the university',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'Miền Bắc',
    description: 'Geographic region of the university',
    enum: ['Miền Bắc', 'Miền Trung', 'Miền Nam'],
    nullable: true,
  })
  @IsString()
  @IsIn(['Miền Bắc', 'Miền Trung', 'Miền Nam'])
  @IsOptional()
  region?: string | null;

  @ApiPropertyOptional({
    example: 'logos/ftu_logo.png',
    description: 'Storage key for the university logo',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  logo_storage_key?: string | null;

  @ApiPropertyOptional({
    example: '25,000,000 - 60,000,000 VND/year',
    description: 'Tuition fee details',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  tuition_fees?: string | null;

  @ApiPropertyOptional({
    example: false,
    description: 'Verification status of the university',
  })
  @IsBoolean()
  @IsOptional()
  is_verified?: boolean;
}
