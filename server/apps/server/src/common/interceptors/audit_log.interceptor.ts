import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogsService } from '../../modules/audit_logs/audit_logs.service';
import { Request } from 'express';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request & { user?: { id: string } }>();

    return next.handle().pipe(
      tap({
        next: (responseBody: unknown) => {
          this.logAudit(request, responseBody).catch((err) => {
            console.error('Failed to create audit log:', err);
          });
        },
      }),
    );
  }

  private async logAudit(
    request: Request & { user?: { id: string } },
    responseBody: unknown,
  ): Promise<void> {
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';

    const isWrite = ['POST', 'PATCH', 'PUT', 'DELETE'].includes(method);
    if (!isWrite) return;

    const body = (request.body || {}) as Record<string, unknown>;
    const params = (request.params || {}) as Record<string, string | undefined>;
    const resBody = (responseBody || {}) as {
      id?: string;
      user?: { id?: string };
    };

    let action = '';
    let entityName = '';
    let userId = request.user?.id;
    const entityId = params.id || (body.id as string | undefined) || resBody.id;

    const pathSegments = url.split('?')[0].split('/').filter(Boolean);
    const baseSegment = pathSegments[0] || 'system';

    entityName = baseSegment;

    if (url.includes('/auth/login')) {
      action = 'LOGIN';
      entityName = 'users';
      userId = resBody.user?.id || resBody.id;
    } else if (url.includes('/auth/register')) {
      action = 'REGISTER';
      entityName = 'users';
      userId = resBody.user?.id || resBody.id;
    } else if (url.includes('/restore')) {
      action = `RESTORE_${baseSegment.toUpperCase().slice(0, -1)}`;
    } else {
      switch (method) {
        case 'POST':
          action = `CREATE_${baseSegment.toUpperCase().slice(0, -1)}`;
          break;
        case 'PATCH':
        case 'PUT':
          action = `UPDATE_${baseSegment.toUpperCase().slice(0, -1)}`;
          break;
        case 'DELETE':
          action = `DELETE_${baseSegment.toUpperCase().slice(0, -1)}`;
          break;
      }
    }

    // Format entities and action names cleanly to avoid plural/syntax issues
    action = action
      .replace('UNIVERSITIE', 'UNIVERSITY')
      .replace('NOTE', 'NOTE')
      .replace('STUDENT_GRADE', 'STUDENT_GRADE')
      .replace('UNIVERSITY_REVIEW', 'UNIVERSITY_REVIEW')
      .replace('NOTIFICATION', 'NOTIFICATION')
      .replace('FILE_NODE', 'FILE_NODE')
      .replace('STUDENT_VERIFICATION', 'STUDENT_VERIFICATION');

    const metaPayload = { ...body };
    if ('password' in metaPayload) delete metaPayload.password;
    if ('password_hash' in metaPayload) delete metaPayload.password_hash;

    await this.auditLogsService.create({
      user_id: userId,
      action,
      entity_name: entityName,
      entity_id: entityId,
      ip_address: ip,
      user_agent: userAgent,
      meta_payload: metaPayload,
    });
  }
}
