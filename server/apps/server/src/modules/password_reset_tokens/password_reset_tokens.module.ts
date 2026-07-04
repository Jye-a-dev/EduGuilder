import { Module, forwardRef } from '@nestjs/common';
import { PasswordResetTokensController } from './password_reset_tokens.controller';
import { PasswordResetTokensService } from './password_reset_tokens.service';
import { PasswordResetTokensRepository } from './repositories/password_reset_tokens.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [PasswordResetTokensController],
  providers: [PasswordResetTokensService, PasswordResetTokensRepository],
  exports: [PasswordResetTokensService, PasswordResetTokensRepository],
})
export class PasswordResetTokensModule {}
