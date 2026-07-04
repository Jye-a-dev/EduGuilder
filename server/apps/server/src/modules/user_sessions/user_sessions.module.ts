import { Module, forwardRef } from '@nestjs/common';
import { UserSessionsController } from './user_sessions.controller';
import { UserSessionsService } from './user_sessions.service';
import { UserSessionsRepository } from './repositories/user_sessions.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [UserSessionsController],
  providers: [UserSessionsService, UserSessionsRepository],
  exports: [UserSessionsService, UserSessionsRepository],
})
export class UserSessionsModule {}
