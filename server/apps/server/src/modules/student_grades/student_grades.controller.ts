import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { StudentGradesService } from './student_grades.service';
import { CreateStudentGradeDto } from './dto/create_student_grade.dto';
import { UpdateStudentGradeDto } from './dto/update_student_grade.dto';
import { QueryStudentGradeDto } from './dto/query_student_grade.dto';
import { ApiStudentGrades } from './student_grades.swagger';
import { StudentGrade } from './entities/student_grade.entity';

@Controller('student_grades')
@ApiStudentGrades.controller()
export class StudentGradesController {
  constructor(private readonly service: StudentGradesService) {}

  @Post()
  @ApiStudentGrades.create()
  create(@Body() createDto: CreateStudentGradeDto): Promise<StudentGrade> {
    return this.service.create(createDto);
  }

  @Get()
  @ApiStudentGrades.findAll()
  findAll(
    @Query() queryDto: QueryStudentGradeDto,
  ): Promise<{ data: StudentGrade[]; total: number }> {
    return this.service.findAll(queryDto);
  }

  @Get('count')
  @ApiStudentGrades.count()
  async count(
    @Query() queryDto: QueryStudentGradeDto,
  ): Promise<{ count: number }> {
    const countFilters = { ...queryDto };
    delete countFilters.page;
    delete countFilters.limit;
    const total = await this.service.count(countFilters);
    return { count: total };
  }

  @Get(':id')
  @ApiStudentGrades.findOne()
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<StudentGrade> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiStudentGrades.update()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateStudentGradeDto,
  ): Promise<StudentGrade> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiStudentGrades.remove()
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.service.remove(id);
    return {
      message: `Grade record with ID ${id} was successfully deleted.`,
    };
  }
}
