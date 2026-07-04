import { Module, forwardRef } from '@nestjs/common';
import { OAuthAccountsController } from './oauth_accounts.controller';
import { OAuthAccountsService } from './oauth_accounts.service';
import { OAuthAccountsRepository } from './repositories/oauth_accounts.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [OAuthAccountsController],
  providers: [OAuthAccountsService, OAuthAccountsRepository],
  exports: [OAuthAccountsService, OAuthAccountsRepository],
})
export class OAuthAccountsModule {}
