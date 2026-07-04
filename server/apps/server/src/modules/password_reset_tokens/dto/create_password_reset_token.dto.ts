import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsString } from 'class-validator';

export class CreatePasswordResetTokenDto {
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'User ID for password reset token',
  })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    example: 'd512a... (hashed token)',
    description: 'Hashed token to store',
  })
  @IsString()
  @IsNotEmpty()
  token_hash: string;
}
