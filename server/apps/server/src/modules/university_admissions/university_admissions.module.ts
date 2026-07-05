import { Module } from '@nestjs/common';
import { UniversityAdmissionsController } from './university_admissions.controller';
import { UniversityAdmissionsService } from './university_admissions.service';
import { UniversityAdmissionsRepository } from './repositories/university_admissions.repository';
import { UniversitiesModule } from '../universities/universities.module';

@Module({
  imports: [UniversitiesModule],
  controllers: [UniversityAdmissionsController],
  providers: [UniversityAdmissionsService, UniversityAdmissionsRepository],
  exports: [UniversityAdmissionsService, UniversityAdmissionsRepository],
})
export class UniversityAdmissionsModule {}
