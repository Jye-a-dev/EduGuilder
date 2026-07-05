import { ApiProperty } from '@nestjs/swagger';
import { StudentGrade as IStudentGrade } from '../interfaces/student_grade.interface';

export class StudentGrade implements IStudentGrade {
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Unique grade record identifier (UUID)',
  })
  id: string;

  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Associated student (user) ID',
  })
  student_id: string;

  @ApiProperty({
    example: '2023.1',
    description: 'Semester code (e.g. 2023.1, 2023.2)',
  })
  semester: string;

  @ApiProperty({
    example: 'Mathematics',
    description: 'Name of the subject',
  })
  subject_name: string;

  @ApiProperty({
    example: 9.5,
    description: 'Subject score (0.00 to 10.00)',
  })
  score: number;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: Date;
}
