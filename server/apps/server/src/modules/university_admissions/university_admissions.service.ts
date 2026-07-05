import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UniversityAdmissionsRepository } from './repositories/university_admissions.repository';
import { CreateUniversityAdmissionDto } from './dto/create_university_admission.dto';
import { UpdateUniversityAdmissionDto } from './dto/update_university_admission.dto';
import { QueryUniversityAdmissionDto } from './dto/query_university_admission.dto';
import { UniversityAdmission } from './entities/university_admission.entity';
import { UniversitiesService } from '../universities/universities.service';

@Injectable()
export class UniversityAdmissionsService {
  constructor(
    private readonly repository: UniversityAdmissionsRepository,
    private readonly universitiesService: UniversitiesService,
  ) {}

  async create(
    createDto: CreateUniversityAdmissionDto,
  ): Promise<UniversityAdmission> {
    // Validate university exists
    await this.universitiesService.findOne(createDto.university_id);

    // Validate unique constraint
    const existing = await this.repository.findByUniqueKey(
      createDto.university_id,
      createDto.year,
      createDto.major_code,
      createDto.group_code,
    );
    if (existing) {
      throw new ConflictException(
        `Admission record for university, year ${createDto.year}, major ${createDto.major_code}, group ${createDto.group_code} already exists`,
      );
    }

    return this.repository.create(createDto);
  }

  async findAll(
    queryDto: QueryUniversityAdmissionDto,
  ): Promise<{ data: UniversityAdmission[]; total: number }> {
    return this.repository.findAll(queryDto);
  }

  async count(
    queryDto: Omit<QueryUniversityAdmissionDto, 'page' | 'limit'>,
  ): Promise<number> {
    return this.repository.count(queryDto);
  }

  async findOne(id: string): Promise<UniversityAdmission> {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new NotFoundException(`Admission record with ID ${id} not found`);
    }
    return record;
  }

  async update(
    id: string,
    updateDto: UpdateUniversityAdmissionDto,
  ): Promise<UniversityAdmission> {
    const existingRecord = await this.findOne(id);

    if (updateDto.university_id) {
      await this.universitiesService.findOne(updateDto.university_id);
    }

    const universityId =
      updateDto.university_id ?? existingRecord.university_id;
    const year = updateDto.year ?? existingRecord.year;
    const majorCode = updateDto.major_code ?? existingRecord.major_code;
    const groupCode = updateDto.group_code ?? existingRecord.group_code;

    // Check if unique key changes and conflicts
    if (
      updateDto.university_id ||
      updateDto.year ||
      updateDto.major_code ||
      updateDto.group_code
    ) {
      const duplicate = await this.repository.findByUniqueKey(
        universityId,
        year,
        majorCode,
        groupCode,
      );
      if (duplicate && duplicate.id !== id) {
        throw new ConflictException(
          `Admission record for university, year ${year}, major ${majorCode}, group ${groupCode} already exists`,
        );
      }
    }

    const updated = await this.repository.update(id, updateDto);
    if (!updated) {
      throw new NotFoundException(`Admission record with ID ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    const success = await this.repository.delete(id);
    if (!success) {
      throw new NotFoundException(
        `Admission record with ID ${id} could not be deleted`,
      );
    }
  }
}
