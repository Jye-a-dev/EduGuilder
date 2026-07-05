import { ApiProperty } from '@nestjs/swagger';
import { UniversityAdmission as IUniversityAdmission } from '../interfaces/university_admission.interface';

export class UniversityAdmission implements IUniversityAdmission {
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Unique admission record identifier (UUID)',
  })
  id: string;

  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Associated university ID',
  })
  university_id: string;

  @ApiProperty({
    example: 2024,
    description: 'Admission year',
  })
  year: number;

  @ApiProperty({
    example: '7340101',
    description: 'Major code',
  })
  major_code: string;

  @ApiProperty({
    example: 'Business Administration',
    description: 'Name of the major',
  })
  major_name: string;

  @ApiProperty({
    example: 150,
    default: 0,
    description: 'Admission quota for the major',
  })
  quota: number;

  @ApiProperty({
    example: 27.5,
    description: 'Benchmark/cutoff score for admission',
  })
  benchmark_score: number;

  @ApiProperty({
    example: 'A00',
    description: 'Subject group code (e.g. A00, A01, D01)',
  })
  group_code: string;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: Date;
}
