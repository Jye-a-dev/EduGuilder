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
import { UniversityAdmissionsService } from './university_admissions.service';
import { CreateUniversityAdmissionDto } from './dto/create_university_admission.dto';
import { UpdateUniversityAdmissionDto } from './dto/update_university_admission.dto';
import { QueryUniversityAdmissionDto } from './dto/query_university_admission.dto';
import { ApiUniversityAdmissions } from './university_admissions.swagger';
import { UniversityAdmission } from './entities/university_admission.entity';

@Controller('university_admissions')
@ApiUniversityAdmissions.controller()
export class UniversityAdmissionsController {
  constructor(private readonly service: UniversityAdmissionsService) {}

  @Post()
  @ApiUniversityAdmissions.create()
  create(
    @Body() createDto: CreateUniversityAdmissionDto,
  ): Promise<UniversityAdmission> {
    return this.service.create(createDto);
  }

  @Get()
  @ApiUniversityAdmissions.findAll()
  findAll(
    @Query() queryDto: QueryUniversityAdmissionDto,
  ): Promise<{ data: UniversityAdmission[]; total: number }> {
    return this.service.findAll(queryDto);
  }

  @Get('count')
  @ApiUniversityAdmissions.count()
  async count(
    @Query() queryDto: QueryUniversityAdmissionDto,
  ): Promise<{ count: number }> {
    const countFilters = { ...queryDto };
    delete countFilters.page;
    delete countFilters.limit;
    const total = await this.service.count(countFilters);
    return { count: total };
  }

  @Get(':id')
  @ApiUniversityAdmissions.findOne()
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UniversityAdmission> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiUniversityAdmissions.update()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateUniversityAdmissionDto,
  ): Promise<UniversityAdmission> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiUniversityAdmissions.remove()
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.service.remove(id);
    return {
      message: `Admission record with ID ${id} was successfully deleted.`,
    };
  }
}
