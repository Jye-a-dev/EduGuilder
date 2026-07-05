import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class UpdateStudentGradeDto {
  @ApiPropertyOptional({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Associated student (user) ID',
  })
  @IsUUID()
  @IsOptional()
  student_id?: string;

  @ApiPropertyOptional({
    example: '2023.1',
    description: 'Semester code (e.g. 2023.1, 2023.2)',
  })
  @IsString()
  @IsOptional()
  semester?: string;

  @ApiPropertyOptional({
    example: 'Mathematics',
    description: 'Name of the subject',
  })
  @IsString()
  @IsOptional()
  subject_name?: string;

  @ApiPropertyOptional({
    example: 9.5,
    description: 'Subject score (0.00 to 10.00)',
  })
  @IsNumber()
  @Min(0)
  @Max(10)
  @IsOptional()
  score?: number;
}
