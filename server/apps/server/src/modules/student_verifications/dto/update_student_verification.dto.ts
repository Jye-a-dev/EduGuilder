import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsEnum } from 'class-validator';
import { VerifyStatus } from '../interfaces/student_verification.interface';

export class UpdateStudentVerificationDto {
  @ApiPropertyOptional({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Associated student (user) ID',
  })
  @IsUUID()
  @IsOptional()
  student_id?: string;

  @ApiPropertyOptional({
    example: 'cards/student_card_123.jpg',
    description: 'Storage key for the uploaded student card image',
  })
  @IsString()
  @IsOptional()
  card_image_key?: string;

  @ApiPropertyOptional({
    enum: VerifyStatus,
    description: 'Verification review status',
  })
  @IsEnum(VerifyStatus)
  @IsOptional()
  status?: VerifyStatus;

  @ApiPropertyOptional({
    example: 'Image was blurry.',
    description: 'Reason for rejection if status is rejected',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  reject_reason?: string | null;

  @ApiPropertyOptional({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'ID of the admin user who verified the request',
    nullable: true,
  })
  @IsUUID()
  @IsOptional()
  verified_by?: string | null;
}
