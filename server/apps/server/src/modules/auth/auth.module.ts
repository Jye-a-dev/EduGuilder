import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { UserSessionsModule } from '../user_sessions/user_sessions.module';
import { PasswordResetTokensModule } from '../password_reset_tokens/password_reset_tokens.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => UserSessionsModule),
    forwardRef(() => PasswordResetTokensModule),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
