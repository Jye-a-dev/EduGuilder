import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateStudentGradeDto {
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Associated student (user) ID',
  })
  @IsUUID()
  @IsNotEmpty()
  student_id: string;

  @ApiProperty({
    example: '2023.1',
    description: 'Semester code (e.g. 2023.1, 2023.2)',
  })
  @IsString()
  @IsNotEmpty()
  semester: string;

  @ApiProperty({
    example: 'Mathematics',
    description: 'Name of the subject',
  })
  @IsString()
  @IsNotEmpty()
  subject_name: string;

  @ApiProperty({
    example: 9.5,
    description: 'Subject score (0.00 to 10.00)',
  })
  @IsNumber()
  @Min(0)
  @Max(10)
  @IsNotEmpty()
  score: number;
}
