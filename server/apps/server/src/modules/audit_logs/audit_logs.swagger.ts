import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuditLog } from './entities/audit_log.entity';

export const ApiAuditLogs = {
  controller: () => applyDecorators(ApiTags('Audit Logs'), ApiBearerAuth()),

  create: () =>
    applyDecorators(
      ApiOperation({ summary: 'Log a new event/action in the audit log' }),
      ApiResponse({ status: 201, type: AuditLog }),
    ),

  findAll: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get paginated list of audit logs' }),
      ApiResponse({ status: 200 }),
    ),

  findOne: () =>
    applyDecorators(
      ApiOperation({ summary: 'Get details of a single audit log' }),
      ApiParam({ name: 'id', type: String }),
      ApiResponse({ status: 200, type: AuditLog }),
    ),
};
