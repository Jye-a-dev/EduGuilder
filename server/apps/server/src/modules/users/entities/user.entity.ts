import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User as IUser, UserRole } from '../interfaces/user.interface';
import { OAuthAccount } from '../../oauth_accounts/entities/oauth_account.entity';
import { PasswordResetToken } from '../../password_reset_tokens/entities/password_reset_token.entity';
import { UserSession } from '../../user_sessions/entities/user_session.entity';

export class User implements IUser {
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Unique user identifier (UUID)',
  })
  id: string;

  @ApiProperty({
    example: 'student@example.com',
    description: 'User email address',
  })
  email: string;

  @ApiPropertyOptional({
    example: '$2b$10$abcdef...',
    description: 'Hashed password',
    nullable: true,
  })
  password_hash?: string | null;

  @ApiProperty({
    example: 'Nguyen Van A',
    description: 'Full name of the user',
  })
  full_name: string;

  @ApiProperty({
    enum: ['admin', 'uni', 'student'],
    default: 'student',
    description: 'User system role',
  })
  role: UserRole;

  @ApiPropertyOptional({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'Associated university ID',
    nullable: true,
  })
  university_id?: string | null;

  @ApiPropertyOptional({
    example: 12,
    description: 'Current grade (1-12) for student role',
    minimum: 1,
    maximum: 12,
    nullable: true,
  })
  current_grade?: number | null;

  @ApiProperty({
    example: 0,
    default: 0,
    description: 'Gamification reward points',
  })
  eco_points: number;

  @ApiPropertyOptional({
    description: 'Timestamp when the user was soft deleted',
    nullable: true,
  })
  deleted_at?: Date | null;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at: Date;

  @ApiPropertyOptional({
    type: () => [OAuthAccount],
    description: 'Linked OAuth accounts',
  })
  oauth_accounts?: OAuthAccount[];

  @ApiPropertyOptional({
    type: () => [PasswordResetToken],
    description: 'Associated password reset tokens',
  })
  password_reset_tokens?: PasswordResetToken[];

  @ApiPropertyOptional({
    type: () => [UserSession],
    description: 'User sessions',
  })
  user_sessions?: UserSession[];
}
