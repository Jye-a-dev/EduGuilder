import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { AuditLogsService } from './audit_logs.service';
import { CreateAuditLogDto } from './dto/create_audit_log.dto';
import { QueryAuditLogDto } from './dto/query_audit_log.dto';
import { ApiAuditLogs } from './audit_logs.swagger';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('audit_logs')
@UseGuards(AuthGuard)
@ApiAuditLogs.controller()
export class AuditLogsController {
  constructor(private readonly service: AuditLogsService) {}

  @Post()
  @ApiAuditLogs.create()
  create(@Body() createDto: CreateAuditLogDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiAuditLogs.findAll()
  findAll(@Query() queryDto: QueryAuditLogDto) {
    return this.service.findAll(queryDto);
  }

  @Get(':id')
  @ApiAuditLogs.findOne()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }
}
