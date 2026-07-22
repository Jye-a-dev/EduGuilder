import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UniversityReview {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  university_id: string;

  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  reviewer_id: string;

  @ApiProperty({ example: 5, description: 'Rating from 1 to 5 stars' })
  rating_stars: number;

  @ApiProperty({ example: 'Great environment and teachers!' })
  comment: string;

  @ApiPropertyOptional({ example: 'Thank you for your feedback.' })
  official_reply?: string;

  @ApiProperty({ example: false })
  is_approved: boolean;

  @ApiPropertyOptional({ description: 'Timestamp of deletion' })
  deleted_at?: Date;

  @ApiPropertyOptional({ example: { c1: 5, c2: 4, c3: 5, c4: 3 } })
  ratings?: Record<string, number>;

  @ApiProperty({ example: '2026-07-05T09:27:25Z' })
  created_at: Date;

  @ApiProperty({ example: '2026-07-05T09:27:25Z' })
  updated_at: Date;
}
