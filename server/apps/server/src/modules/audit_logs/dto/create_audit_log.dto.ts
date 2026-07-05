import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsObject,
} from 'class-validator';

export class CreateAuditLogDto {
  @ApiPropertyOptional({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @IsUUID()
  @IsOptional()
  user_id?: string;

  @ApiProperty({ example: 'CREATE_NOTE' })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({ example: 'notes' })
  @IsString()
  @IsNotEmpty()
  entity_name: string;

  @ApiPropertyOptional({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @IsUUID()
  @IsOptional()
  entity_id?: string;

  @ApiPropertyOptional({ example: '127.0.0.1' })
  @IsString()
  @IsOptional()
  ip_address?: string;

  @ApiPropertyOptional({ example: 'Mozilla/5.0 ...' })
  @IsString()
  @IsOptional()
  user_agent?: string;

  @ApiPropertyOptional({ example: { change: 'created' } })
  @IsObject()
  @IsOptional()
  meta_payload?: any;
}
