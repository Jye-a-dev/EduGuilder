import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UniversityReviewsRepository } from './repositories/university_reviews.repository';
import { CreateUniversityReviewDto } from './dto/create_university_review.dto';
import { UpdateUniversityReviewDto } from './dto/update_university_review.dto';
import { QueryUniversityReviewDto } from './dto/query_university_review.dto';
import { UniversityReview } from './entities/university_review.entity';

@Injectable()
export class UniversityReviewsService {
  constructor(private readonly repository: UniversityReviewsRepository) {}

  async create(dto: CreateUniversityReviewDto): Promise<UniversityReview> {
    return this.repository.create(dto);
  }

  async findAll(
    queryDto: QueryUniversityReviewDto,
  ): Promise<{ data: UniversityReview[]; total: number }> {
    return this.repository.findAll(queryDto);
  }

  async findOne(id: string): Promise<UniversityReview> {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new NotFoundException(`University review with ID ${id} not found`);
    }
    return record;
  }

  async update(
    id: string,
    dto: UpdateUniversityReviewDto,
  ): Promise<UniversityReview> {
    await this.findOne(id);
    const updated = await this.repository.update(id, dto);
    return updated!;
  }

  async remove(id: string, hardDelete = false): Promise<void> {
    await this.findOne(id);
    const success = hardDelete
      ? await this.repository.hardDelete(id)
      : await this.repository.softDelete(id);

    if (!success) {
      throw new NotFoundException(
        `University review with ID ${id} could not be deleted`,
      );
    }
  }

  async restore(id: string): Promise<void> {
    const success = await this.repository.restore(id);
    if (!success) {
      throw new ConflictException(
        `University review with ID ${id} is not deleted or could not be restored`,
      );
    }
  }
}
