import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PasswordResetToken as IPasswordResetToken } from '../interfaces/password_reset_token.interface';

export class PasswordResetToken implements IPasswordResetToken {
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Unique token ID',
  })
  id: string;

  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Associated User ID',
  })
  user_id: string;

  @ApiProperty({
    example: 'd512a... (hashed token)',
    description: 'Hashed token used to identify and validate reset request',
  })
  token_hash: string;

  @ApiProperty({ description: 'Expiration date/time' })
  expires_at: Date;

  @ApiPropertyOptional({
    description: 'Timestamp when this token was consumed',
    nullable: true,
  })
  used_at?: Date | null;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: Date;
}
