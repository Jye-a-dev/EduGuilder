import { Injectable, NotFoundException } from '@nestjs/common';
import { StudentVerificationsRepository } from './repositories/student_verifications.repository';
import { CreateStudentVerificationDto } from './dto/create_student_verification.dto';
import { UpdateStudentVerificationDto } from './dto/update_student_verification.dto';
import { QueryStudentVerificationDto } from './dto/query_student_verification.dto';
import { StudentVerification } from './entities/student_verification.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class StudentVerificationsService {
  constructor(
    private readonly repository: StudentVerificationsRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(
    createDto: CreateStudentVerificationDto,
  ): Promise<StudentVerification> {
    // Validate student exists
    await this.usersService.findOne(createDto.student_id);

    return this.repository.create(createDto);
  }

  async findAll(
    queryDto: QueryStudentVerificationDto,
  ): Promise<{ data: StudentVerification[]; total: number }> {
    return this.repository.findAll(queryDto);
  }

  async count(
    queryDto: Omit<QueryStudentVerificationDto, 'page' | 'limit'>,
  ): Promise<number> {
    return this.repository.count(queryDto);
  }

  async findOne(id: string): Promise<StudentVerification> {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new NotFoundException(
        `Verification request with ID ${id} not found`,
      );
    }
    return record;
  }

  async update(
    id: string,
    updateDto: UpdateStudentVerificationDto,
  ): Promise<StudentVerification> {
    await this.findOne(id); // Ensure exists

    if (updateDto.student_id) {
      await this.usersService.findOne(updateDto.student_id);
    }

    if (updateDto.verified_by) {
      await this.usersService.findOne(updateDto.verified_by);
    }

    const updated = await this.repository.update(id, updateDto);
    if (!updated) {
      throw new NotFoundException(
        `Verification request with ID ${id} not found`,
      );
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    const success = await this.repository.delete(id);
    if (!success) {
      throw new NotFoundException(
        `Verification request with ID ${id} could not be deleted`,
      );
    }
  }
}
