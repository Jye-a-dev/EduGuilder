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
import { StudentVerificationsService } from './student_verifications.service';
import { CreateStudentVerificationDto } from './dto/create_student_verification.dto';
import { UpdateStudentVerificationDto } from './dto/update_student_verification.dto';
import { QueryStudentVerificationDto } from './dto/query_student_verification.dto';
import { ApiStudentVerifications } from './student_verifications.swagger';
import { StudentVerification } from './entities/student_verification.entity';

@Controller('student_verifications')
@ApiStudentVerifications.controller()
export class StudentVerificationsController {
  constructor(private readonly service: StudentVerificationsService) {}

  @Post()
  @ApiStudentVerifications.create()
  create(
    @Body() createDto: CreateStudentVerificationDto,
  ): Promise<StudentVerification> {
    return this.service.create(createDto);
  }

  @Get()
  @ApiStudentVerifications.findAll()
  findAll(
    @Query() queryDto: QueryStudentVerificationDto,
  ): Promise<{ data: StudentVerification[]; total: number }> {
    return this.service.findAll(queryDto);
  }

  @Get('count')
  @ApiStudentVerifications.count()
  async count(
    @Query() queryDto: QueryStudentVerificationDto,
  ): Promise<{ count: number }> {
    const countFilters = { ...queryDto };
    delete countFilters.page;
    delete countFilters.limit;
    const total = await this.service.count(countFilters);
    return { count: total };
  }

  @Get(':id')
  @ApiStudentVerifications.findOne()
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StudentVerification> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiStudentVerifications.update()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateStudentVerificationDto,
  ): Promise<StudentVerification> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiStudentVerifications.remove()
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.service.remove(id);
    return {
      message: `Verification request with ID ${id} was successfully deleted.`,
    };
  }
}
