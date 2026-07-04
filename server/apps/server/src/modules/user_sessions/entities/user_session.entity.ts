import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserSession as IUserSession } from '../interfaces/user_session.interface';

export class UserSession implements IUserSession {
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Unique session ID',
  })
  id: string;

  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Associated User ID',
  })
  user_id: string;

  @ApiProperty({
    example: 'sha256_hash_here',
    description: 'Hashed refresh token stored in database',
  })
  refresh_token_hash: string;

  @ApiPropertyOptional({
    example: 'Mozilla/5.0 ...',
    description: 'User agent of the device',
    nullable: true,
  })
  user_agent?: string | null;

  @ApiPropertyOptional({
    example: '127.0.0.1',
    description: 'IP address of the client device',
    nullable: true,
  })
  ip_address?: string | null;

  @ApiProperty({
    default: false,
    description: 'Status of the session (whether revoked)',
  })
  is_revoked: boolean;

  @ApiProperty({ description: 'Expiration date/time' })
  expires_at: Date;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: Date;
}
