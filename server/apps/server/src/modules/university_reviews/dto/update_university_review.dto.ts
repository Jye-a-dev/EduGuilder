import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  Min,
  Max,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class UpdateUniversityReviewDto {
  @ApiPropertyOptional({ example: 4 })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating_stars?: number;

  @ApiPropertyOptional({ example: 'Good but could be better.' })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiPropertyOptional({ example: 'Thank you, we will work on that.' })
  @IsString()
  @IsOptional()
  official_reply?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_approved?: boolean;
}
