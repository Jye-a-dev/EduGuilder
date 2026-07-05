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
import { UniversitiesService } from './universities.service';
import { CreateUniversityDto } from './dto/create_university.dto';
import { UpdateUniversityDto } from './dto/update_university.dto';
import { QueryUniversityDto } from './dto/query_university.dto';
import { ApiUniversities } from './universities.swagger';
import { University } from './entities/university.entity';

@Controller('universities')
@ApiUniversities.controller()
export class UniversitiesController {
  constructor(private readonly service: UniversitiesService) {}

  @Post()
  @ApiUniversities.create()
  create(@Body() createDto: CreateUniversityDto): Promise<University> {
    return this.service.create(createDto);
  }

  @Get()
  @ApiUniversities.findAll()
  findAll(
    @Query() queryDto: QueryUniversityDto,
  ): Promise<{ data: University[]; total: number }> {
    return this.service.findAll(queryDto);
  }

  @Get('count')
  @ApiUniversities.count()
  async count(
    @Query() queryDto: QueryUniversityDto,
  ): Promise<{ count: number }> {
    const countFilters = { ...queryDto };
    delete countFilters.page;
    delete countFilters.limit;
    const total = await this.service.count(countFilters);
    return { count: total };
  }

  @Get(':id')
  @ApiUniversities.findOne()
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<University> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiUniversities.update()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateUniversityDto,
  ): Promise<University> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiUniversities.remove()
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('hardDelete') hardDelete?: string,
  ): Promise<{ message: string }> {
    const shouldHardDelete = hardDelete === 'true';
    await this.service.remove(id, shouldHardDelete);
    return {
      message: `University with ID ${id} was successfully ${
        shouldHardDelete ? 'hard' : 'soft'
      } deleted.`,
    };
  }

  @Post(':id/restore')
  @HttpCode(200)
  @ApiUniversities.restore()
  async restore(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.service.restore(id);
    return { message: `University with ID ${id} was successfully restored.` };
  }
}
