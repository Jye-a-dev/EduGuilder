import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { OAuthProvider } from '../interfaces/oauth_account.interface';

export class CreateOAuthAccountDto {
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'User ID to link OAuth account to',
  })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    enum: OAuthProvider,
    description: 'OAuth provider',
  })
  @IsEnum(OAuthProvider)
  @IsNotEmpty()
  provider: OAuthProvider;

  @ApiProperty({
    example: '1234567890',
    description: 'Unique ID provided by OAuth service provider',
  })
  @IsString()
  @IsNotEmpty()
  provider_user_id: string;

  @ApiPropertyOptional({
    example: { name: 'John Doe', avatar: 'url' },
    description: 'Metadata returned by the provider',
  })
  @IsOptional()
  meta_data?: any;
}
