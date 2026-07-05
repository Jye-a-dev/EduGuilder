import { Module } from '@nestjs/common';
import { UniversityReviewsController } from './university_reviews.controller';
import { UniversityReviewsService } from './university_reviews.service';
import { UniversityReviewsRepository } from './repositories/university_reviews.repository';

@Module({
  controllers: [UniversityReviewsController],
  providers: [UniversityReviewsService, UniversityReviewsRepository],
  exports: [UniversityReviewsService, UniversityReviewsRepository],
})
export class UniversityReviewsModule {}
