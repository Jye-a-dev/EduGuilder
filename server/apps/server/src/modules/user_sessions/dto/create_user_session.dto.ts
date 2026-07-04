import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsOptional,
  IsIP,
} from 'class-validator';

export class CreateUserSessionDto {
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'User ID for session',
  })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    example: 'refresh_token_string_here',
    description: 'Raw refresh token string (will be hashed before storing)',
  })
  @IsString()
  @IsNotEmpty()
  refresh_token: string;

  @ApiPropertyOptional({
    example: 'Mozilla/5.0 ...',
    description: 'User agent of the device',
  })
  @IsString()
  @IsOptional()
  user_agent?: string;

  @ApiPropertyOptional({
    example: '127.0.0.1',
    description: 'IP address of the client device',
  })
  @IsIP()
  @IsOptional()
  ip_address?: string;
}
