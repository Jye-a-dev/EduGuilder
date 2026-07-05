import { Module } from '@nestjs/common';
import { StudentGradesController } from './student_grades.controller';
import { StudentGradesService } from './student_grades.service';
import { StudentGradesRepository } from './repositories/student_grades.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [StudentGradesController],
  providers: [StudentGradesService, StudentGradesRepository],
  exports: [StudentGradesService, StudentGradesRepository],
})
export class StudentGradesModule {}
