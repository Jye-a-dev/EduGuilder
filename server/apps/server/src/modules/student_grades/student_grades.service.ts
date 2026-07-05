import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { StudentGradesRepository } from './repositories/student_grades.repository';
import { CreateStudentGradeDto } from './dto/create_student_grade.dto';
import { UpdateStudentGradeDto } from './dto/update_student_grade.dto';
import { QueryStudentGradeDto } from './dto/query_student_grade.dto';
import { StudentGrade } from './entities/student_grade.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class StudentGradesService {
  constructor(
    private readonly repository: StudentGradesRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(createDto: CreateStudentGradeDto): Promise<StudentGrade> {
    // Validate student exists
    await this.usersService.findOne(createDto.student_id);

    // Validate unique key
    const existing = await this.repository.findByUniqueKey(
      createDto.student_id,
      createDto.semester,
      createDto.subject_name,
    );
    if (existing) {
      throw new ConflictException(
        `Grade record for student, semester ${createDto.semester}, subject ${createDto.subject_name} already exists`,
      );
    }

    return this.repository.create(createDto);
  }

  async findAll(
    queryDto: QueryStudentGradeDto,
  ): Promise<{ data: StudentGrade[]; total: number }> {
    return this.repository.findAll(queryDto);
  }

  async count(
    queryDto: Omit<QueryStudentGradeDto, 'page' | 'limit'>,
  ): Promise<number> {
    return this.repository.count(queryDto);
  }

  async findOne(id: string): Promise<StudentGrade> {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new NotFoundException(`Grade record with ID ${id} not found`);
    }
    return record;
  }

  async update(
    id: string,
    updateDto: UpdateStudentGradeDto,
  ): Promise<StudentGrade> {
    const existingRecord = await this.findOne(id);

    if (updateDto.student_id) {
      await this.usersService.findOne(updateDto.student_id);
    }

    const studentId = updateDto.student_id ?? existingRecord.student_id;
    const semester = updateDto.semester ?? existingRecord.semester;
    const subjectName = updateDto.subject_name ?? existingRecord.subject_name;

    if (updateDto.student_id || updateDto.semester || updateDto.subject_name) {
      const duplicate = await this.repository.findByUniqueKey(
        studentId,
        semester,
        subjectName,
      );
      if (duplicate && duplicate.id !== id) {
        throw new ConflictException(
          `Grade record for student, semester ${semester}, subject ${subjectName} already exists`,
        );
      }
    }

    const updated = await this.repository.update(id, updateDto);
    if (!updated) {
      throw new NotFoundException(`Grade record with ID ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    const success = await this.repository.delete(id);
    if (!success) {
      throw new NotFoundException(
        `Grade record with ID ${id} could not be deleted`,
      );
    }
  }
}
