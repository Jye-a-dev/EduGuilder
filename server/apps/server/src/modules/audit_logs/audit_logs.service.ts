import { Injectable, NotFoundException } from '@nestjs/common';
import { AuditLogsRepository } from './repositories/audit_logs.repository';
import { CreateAuditLogDto } from './dto/create_audit_log.dto';
import { QueryAuditLogDto } from './dto/query_audit_log.dto';
import { AuditLog } from './entities/audit_log.entity';

@Injectable()
export class AuditLogsService {
  constructor(private readonly repository: AuditLogsRepository) {}

  async create(dto: CreateAuditLogDto): Promise<AuditLog> {
    return this.repository.create(dto);
  }

  async findAll(
    queryDto: QueryAuditLogDto,
  ): Promise<{ data: AuditLog[]; total: number }> {
    return this.repository.findAll(queryDto);
  }

  async findOne(id: string): Promise<AuditLog> {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new NotFoundException(`Audit log with ID ${id} not found`);
    }
    return record;
  }
}
