import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  StudentVerification as IStudentVerification,
  VerifyStatus,
} from '../interfaces/student_verification.interface';

export class StudentVerification implements IStudentVerification {
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Unique verification request ID (UUID)',
  })
  id: string;

  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Associated student (user) ID',
  })
  student_id: string;

  @ApiProperty({
    example: 'cards/student_card_123.jpg',
    description: 'Storage key for the uploaded student card image',
  })
  card_image_key: string;

  @ApiProperty({
    enum: VerifyStatus,
    default: VerifyStatus.PENDING,
    description: 'Verification review status',
  })
  status: VerifyStatus;

  @ApiPropertyOptional({
    example: 'Image was blurry.',
    description: 'Reason for rejection if status is rejected',
    nullable: true,
  })
  reject_reason?: string | null;

  @ApiPropertyOptional({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'ID of the admin user who verified the request',
    nullable: true,
  })
  verified_by?: string | null;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at: Date;
}
