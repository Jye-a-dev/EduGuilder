import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Notification {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  user_id: string;

  @ApiProperty({ example: 'Verification Approved' })
  title: string;

  @ApiProperty({
    example: 'Your student verification request has been approved by admin.',
  })
  body: string;

  @ApiProperty({ example: false })
  is_read: boolean;

  @ApiPropertyOptional({
    example: '/profile/verification',
    description: 'Redirect path on click',
  })
  link_to?: string;

  @ApiProperty({ example: '2026-07-05T09:27:25Z' })
  created_at: Date;
}
