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
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create_note.dto';
import { UpdateNoteDto } from './dto/update_note.dto';
import { QueryNoteDto } from './dto/query_note.dto';
import {
  LinkNoteDto,
  CreateNoteTableDto,
  CreateNoteSlideDto,
} from './dto/note_sub_items.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiNotes } from './notes.swagger';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('notes')
@UseGuards(AuthGuard)
@SkipThrottle()
@ApiNotes.controller()
export class NotesController {
  constructor(private readonly service: NotesService) {}

  @Post()
  @ApiNotes.create()
  create(@Body() createDto: CreateNoteDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiNotes.findAll()
  findAll(@Query() queryDto: QueryNoteDto) {
    return this.service.findAll(queryDto);
  }

  @Get('count')
  @ApiNotes.count()
  async count(@Query() queryDto: QueryNoteDto) {
    const countFilters = { ...queryDto };
    delete countFilters.page;
    delete countFilters.limit;
    const total = await this.service.count(countFilters);
    return { count: total };
  }

  @Get(':id')
  @ApiNotes.findOne()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiNotes.update()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateNoteDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiNotes.remove()
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('hardDelete') hardDelete?: string,
  ) {
    const shouldHardDelete = hardDelete === 'true';
    await this.service.remove(id, shouldHardDelete);
    return {
      message: `Note with ID ${id} was successfully ${shouldHardDelete ? 'hard' : 'soft'} deleted.`,
    };
  }

  @Post(':id/restore')
  @HttpCode(200)
  @ApiNotes.restore()
  async restore(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.restore(id);
    return { message: `Note with ID ${id} was successfully restored.` };
  }

  // --- Links ---
  @Post(':id/links')
  @ApiNotes.link()
  linkNote(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() linkDto: LinkNoteDto,
  ) {
    return this.service.linkNotes(id, linkDto.target_note_id);
  }

  @Delete(':id/links/:targetId')
  @HttpCode(200)
  @ApiNotes.unlink()
  async unlinkNote(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('targetId', ParseUUIDPipe) targetId: string,
  ) {
    await this.service.unlinkNotes(id, targetId);
    return {
      message: `Link from note ${id} to ${targetId} was successfully removed.`,
    };
  }

  @Get(':id/links')
  @ApiNotes.getLinks()
  getLinks(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getLinkedNotes(id);
  }

  // --- Tables ---
  @Post(':id/tables')
  @ApiNotes.addTable()
  addTable(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() tableDto: CreateNoteTableDto,
  ) {
    return this.service.addTable(id, tableDto);
  }

  @Delete(':id/tables')
  @HttpCode(200)
  @ApiNotes.clearTables()
  async clearTables(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.clearTables(id);
    return { message: `All tables for note ${id} were successfully deleted.` };
  }

  @Delete(':id/tables/:tableId')
  @HttpCode(200)
  async deleteTable(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('tableId', ParseUUIDPipe) tableId: string,
  ) {
    await this.service.deleteTable(id, tableId);
    return { message: `Table with ID ${tableId} was successfully deleted.` };
  }

  // --- Slides ---
  @Post(':id/slides')
  @ApiNotes.addSlide()
  addSlide(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() slideDto: CreateNoteSlideDto,
  ) {
    return this.service.addSlide(id, slideDto);
  }

  @Delete(':id/slides')
  @HttpCode(200)
  @ApiNotes.clearSlides()
  async clearSlides(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.clearSlides(id);
    return { message: `All slides for note ${id} were successfully deleted.` };
  }

  @Delete(':id/slides/:slideId')
  @HttpCode(200)
  async deleteSlide(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('slideId', ParseUUIDPipe) slideId: string,
  ) {
    await this.service.deleteSlide(id, slideId);
    return { message: `Slide with ID ${slideId} was successfully deleted.` };
  }
}
