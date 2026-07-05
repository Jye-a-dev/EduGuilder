import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuditLog {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @ApiPropertyOptional({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  user_id?: string;

  @ApiProperty({ example: 'CREATE_NOTE' })
  action: string;

  @ApiProperty({ example: 'notes' })
  entity_name: string;

  @ApiPropertyOptional({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  entity_id?: string;

  @ApiPropertyOptional({ example: '127.0.0.1' })
  ip_address?: string;

  @ApiPropertyOptional({ example: 'Mozilla/5.0 ...' })
  user_agent?: string;

  @ApiPropertyOptional({ example: { before: {}, after: {} } })
  meta_payload?: any;

  @ApiProperty({ example: '2026-07-05T09:27:25Z' })
  created_at: Date;
}
