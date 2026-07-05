import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { VerifyStatus } from '../interfaces/student_verification.interface';

export class CreateStudentVerificationDto {
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Associated student (user) ID',
  })
  @IsUUID()
  @IsNotEmpty()
  student_id: string;

  @ApiProperty({
    example: 'cards/student_card_123.jpg',
    description: 'Storage key for the uploaded student card image',
  })
  @IsString()
  @IsNotEmpty()
  card_image_key: string;

  @ApiPropertyOptional({
    enum: VerifyStatus,
    default: VerifyStatus.PENDING,
    description: 'Initial verification review status',
  })
  @IsEnum(VerifyStatus)
  @IsOptional()
  status?: VerifyStatus;
}
