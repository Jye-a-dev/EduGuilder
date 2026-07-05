import { Module } from '@nestjs/common';
import { StudentVerificationsController } from './student_verifications.controller';
import { StudentVerificationsService } from './student_verifications.service';
import { StudentVerificationsRepository } from './repositories/student_verifications.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [StudentVerificationsController],
  providers: [StudentVerificationsService, StudentVerificationsRepository],
  exports: [StudentVerificationsService, StudentVerificationsRepository],
})
export class StudentVerificationsModule {}
