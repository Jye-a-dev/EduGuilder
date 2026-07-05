import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ example: 'System Alert' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Maintenance starts in 10 minutes.' })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiPropertyOptional({ example: '/system' })
  @IsString()
  @IsOptional()
  link_to?: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  is_read?: boolean = false;
}
