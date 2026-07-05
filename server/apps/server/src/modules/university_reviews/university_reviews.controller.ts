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
  UseGuards,
} from '@nestjs/common';
import { UniversityReviewsService } from './university_reviews.service';
import { CreateUniversityReviewDto } from './dto/create_university_review.dto';
import { UpdateUniversityReviewDto } from './dto/update_university_review.dto';
import { QueryUniversityReviewDto } from './dto/query_university_review.dto';
import { ApiUniversityReviews } from './university_reviews.swagger';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('university_reviews')
@UseGuards(AuthGuard)
@ApiUniversityReviews.controller()
export class UniversityReviewsController {
  constructor(private readonly service: UniversityReviewsService) {}

  @Post()
  @ApiUniversityReviews.create()
  create(@Body() createDto: CreateUniversityReviewDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiUniversityReviews.findAll()
  findAll(@Query() queryDto: QueryUniversityReviewDto) {
    return this.service.findAll(queryDto);
  }

  @Get(':id')
  @ApiUniversityReviews.findOne()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiUniversityReviews.update()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateUniversityReviewDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiUniversityReviews.remove()
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('hardDelete') hardDelete?: string,
  ) {
    const shouldHardDelete = hardDelete === 'true';
    await this.service.remove(id, shouldHardDelete);
    return {
      message: `University review with ID ${id} was successfully ${shouldHardDelete ? 'hard' : 'soft'} deleted.`,
    };
  }

  @Post(':id/restore')
  @HttpCode(200)
  @ApiUniversityReviews.restore()
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.restore(id);
    return {
      message: `University review with ID ${id} was successfully restored.`,
    };
  }
}
