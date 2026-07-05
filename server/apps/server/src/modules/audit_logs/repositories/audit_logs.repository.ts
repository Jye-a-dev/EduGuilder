import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../../database/pg.provider';
import { AuditLog } from '../entities/audit_log.entity';
import { QueryAuditLogDto } from '../dto/query_audit_log.dto';

@Injectable()
export class AuditLogsRepository {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  async create(data: Partial<AuditLog>): Promise<AuditLog> {
    const query = `
      INSERT INTO "audit_logs" (
        user_id, action, entity_name, entity_id, ip_address, user_agent, meta_payload
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [
      data.user_id || null,
      data.action,
      data.entity_name,
      data.entity_id || null,
      data.ip_address || null,
      data.user_agent || null,
      data.meta_payload ? JSON.stringify(data.meta_payload) : null,
    ];
    const res = await this.pool.query<AuditLog>(query, values);
    return res.rows[0];
  }

  async findAll(
    queryDto: QueryAuditLogDto,
  ): Promise<{ data: AuditLog[]; total: number }> {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (queryDto.user_id) {
      params.push(queryDto.user_id);
      conditions.push(`user_id = $${params.length}`);
    }

    if (queryDto.action) {
      params.push(queryDto.action);
      conditions.push(`action = $${params.length}`);
    }

    if (queryDto.entity_name) {
      params.push(queryDto.entity_name);
      conditions.push(`entity_name = $${params.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count
    const countQuery = `SELECT COUNT(*)::int FROM "audit_logs" ${whereClause};`;
    const countRes = await this.pool.query<{ count: number }>(
      countQuery,
      params,
    );
    const total = countRes.rows[0].count;

    // Data
    const dataParams = [...params];
    dataParams.push(limit);
    const limitPlaceholder = `$${dataParams.length}`;
    dataParams.push(offset);
    const offsetPlaceholder = `$${dataParams.length}`;

    const dataQuery = `
      SELECT * FROM "audit_logs"
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder};
    `;
    const dataRes = await this.pool.query<AuditLog>(dataQuery, dataParams);

    return {
      data: dataRes.rows,
      total,
    };
  }

  async findById(id: string): Promise<AuditLog | null> {
    const query = 'SELECT * FROM "audit_logs" WHERE id = $1;';
    const res = await this.pool.query<AuditLog>(query, [id]);
    return res.rows[0] || null;
  }
}
