import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { University as IUniversity } from '../interfaces/university.interface';

export class University implements IUniversity {
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Unique university identifier (UUID)',
  })
  id: string;

  @ApiProperty({
    example: 'FTU',
    description: 'Unique short code of the university',
  })
  code: string;

  @ApiProperty({
    example: 'Foreign Trade University',
    description: 'Name of the university',
  })
  name: string;

  @ApiPropertyOptional({
    example: 'logos/ftu_logo.png',
    description: 'Storage key for the university logo',
    nullable: true,
  })
  logo_storage_key?: string | null;

  @ApiPropertyOptional({
    example: '25,000,000 - 60,000,000 VND/year',
    description: 'Tuition fee details',
    nullable: true,
  })
  tuition_fees?: string | null;

  @ApiProperty({
    example: false,
    default: false,
    description: 'Verification status of the university',
  })
  is_verified: boolean;

  @ApiPropertyOptional({
    description: 'Timestamp when the university was soft deleted',
    nullable: true,
  })
  deleted_at?: Date | null;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at: Date;
}
