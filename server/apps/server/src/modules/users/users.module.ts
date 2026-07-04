import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './repositories/users.repository';
import { OAuthAccountsModule } from '../oauth_accounts/oauth_accounts.module';
import { PasswordResetTokensModule } from '../password_reset_tokens/password_reset_tokens.module';
import { UserSessionsModule } from '../user_sessions/user_sessions.module';

@Module({
  imports: [
    forwardRef(() => OAuthAccountsModule),
    forwardRef(() => PasswordResetTokensModule),
    forwardRef(() => UserSessionsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
