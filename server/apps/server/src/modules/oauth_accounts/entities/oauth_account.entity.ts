import { ApiProperty } from '@nestjs/swagger';
import {
  OAuthAccount as IOAuthAccount,
  OAuthProvider,
} from '../interfaces/oauth_account.interface';

export class OAuthAccount implements IOAuthAccount {
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Unique OAuth account ID',
  })
  id: string;

  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Associated User ID',
  })
  user_id: string;

  @ApiProperty({
    enum: OAuthProvider,
    description: 'OAuth provider',
  })
  provider: OAuthProvider;

  @ApiProperty({
    example: '1234567890',
    description: 'Unique ID provided by OAuth service provider',
  })
  provider_user_id: string;

  @ApiProperty({
    example: { name: 'John Doe', avatar: 'url' },
    description: 'Metadata returned by the provider',
  })
  meta_data?: any;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at: Date;
}
