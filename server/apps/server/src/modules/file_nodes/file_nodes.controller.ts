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
import { FileNodesService } from './file_nodes.service';
import { CreateFileNodeDto } from './dto/create_file_node.dto';
import { UpdateFileNodeDto } from './dto/update_file_node.dto';
import { QueryFileNodeDto } from './dto/query_file_node.dto';
import { ApiFileNodes } from './file_nodes.swagger';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('file_nodes')
@UseGuards(AuthGuard)
@ApiFileNodes.controller()
export class FileNodesController {
  constructor(private readonly service: FileNodesService) {}

  @Post()
  @ApiFileNodes.create()
  create(@Body() createDto: CreateFileNodeDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiFileNodes.findAll()
  findAll(@Query() queryDto: QueryFileNodeDto) {
    return this.service.findAll(queryDto);
  }

  @Get('tree')
  @ApiFileNodes.getTree()
  getTree(@Query('student_id', ParseUUIDPipe) studentId: string) {
    return this.service.getTree(studentId);
  }

  @Get(':id')
  @ApiFileNodes.findOne()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiFileNodes.update()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateFileNodeDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiFileNodes.remove()
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.remove(id);
    return { message: `File node with ID ${id} was successfully deleted.` };
  }
}
