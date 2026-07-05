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
import { DocumentExportsService } from './document_exports.service';
import { CreateDocumentExportDto } from './dto/create_document_export.dto';
import { UpdateDocumentExportDto } from './dto/update_document_export.dto';
import { QueryDocumentExportDto } from './dto/query_document_export.dto';
import { ApiDocumentExports } from './document_exports.swagger';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('document_exports')
@UseGuards(AuthGuard)
@ApiDocumentExports.controller()
export class DocumentExportsController {
  constructor(private readonly service: DocumentExportsService) {}

  @Post()
  @ApiDocumentExports.create()
  create(@Body() createDto: CreateDocumentExportDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiDocumentExports.findAll()
  findAll(@Query() queryDto: QueryDocumentExportDto) {
    return this.service.findAll(queryDto);
  }

  @Get(':id')
  @ApiDocumentExports.findOne()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiDocumentExports.update()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateDocumentExportDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiDocumentExports.remove()
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.remove(id);
    return { message: `Export record with ID ${id} was successfully deleted.` };
  }
}
