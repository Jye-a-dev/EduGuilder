import { Module } from '@nestjs/common';
import { AuditLogsController } from './audit_logs.controller';
import { AuditLogsService } from './audit_logs.service';
import { AuditLogsRepository } from './repositories/audit_logs.repository';

@Module({
  controllers: [AuditLogsController],
  providers: [AuditLogsService, AuditLogsRepository],
  exports: [AuditLogsService, AuditLogsRepository],
})
export class AuditLogsModule {}
