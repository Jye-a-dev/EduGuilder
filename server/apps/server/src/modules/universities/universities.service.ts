import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UniversitiesRepository } from './repositories/universities.repository';
import { CreateUniversityDto } from './dto/create_university.dto';
import { UpdateUniversityDto } from './dto/update_university.dto';
import { QueryUniversityDto } from './dto/query_university.dto';
import { University } from './entities/university.entity';

@Injectable()
export class UniversitiesService {
  constructor(
    private readonly universitiesRepository: UniversitiesRepository,
  ) {}

  async create(createDto: CreateUniversityDto): Promise<University> {
    const existing = await this.universitiesRepository.findByCode(
      createDto.code,
    );
    if (existing) {
      throw new ConflictException(
        `University with code ${createDto.code} already exists`,
      );
    }

    return this.universitiesRepository.create(createDto);
  }

  async findAll(
    queryDto: QueryUniversityDto,
  ): Promise<{ data: University[]; total: number }> {
    return this.universitiesRepository.findAll(queryDto);
  }

  async count(
    queryDto: Omit<QueryUniversityDto, 'page' | 'limit'>,
  ): Promise<number> {
    return this.universitiesRepository.count(queryDto);
  }

  async findOne(id: string): Promise<University> {
    const university = await this.universitiesRepository.findById(id);
    if (!university) {
      throw new NotFoundException(`University with ID ${id} not found`);
    }
    return university;
  }

  async update(
    id: string,
    updateDto: UpdateUniversityDto,
  ): Promise<University> {
    await this.findOne(id); // Ensure exists

    if (updateDto.code) {
      const existing = await this.universitiesRepository.findByCode(
        updateDto.code,
      );
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `University with code ${updateDto.code} already exists`,
        );
      }
    }

    const updated = await this.universitiesRepository.update(id, updateDto);
    if (!updated) {
      throw new NotFoundException(`University with ID ${id} not found`);
    }
    return updated;
  }

  async remove(id: string, hardDelete = false): Promise<void> {
    await this.findOne(id); // Ensure exists

    const success = hardDelete
      ? await this.universitiesRepository.hardDelete(id)
      : await this.universitiesRepository.softDelete(id);

    if (!success) {
      throw new NotFoundException(
        `University with ID ${id} could not be deleted`,
      );
    }
  }

  async restore(id: string): Promise<void> {
    const university = await this.universitiesRepository.findById(id);
    if (!university) {
      throw new NotFoundException(`University with ID ${id} not found`);
    }

    const success = await this.universitiesRepository.restore(id);
    if (!success) {
      throw new ConflictException(
        `University with ID ${id} is not deleted or could not be restored`,
      );
    }
  }
}
