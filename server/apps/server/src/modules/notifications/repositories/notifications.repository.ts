import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../../database/pg.provider';
import { Notification } from '../entities/notification.entity';
import { QueryNotificationDto } from '../dto/query_notification.dto';

@Injectable()
export class NotificationsRepository {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  async create(data: Partial<Notification>): Promise<Notification> {
    const query = `
      INSERT INTO "notifications" (
        user_id, title, body, is_read, link_to
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [
      data.user_id,
      data.title,
      data.body,
      data.is_read ?? false,
      data.link_to || null,
    ];
    const res = await this.pool.query<Notification>(query, values);
    return res.rows[0];
  }

  async findAll(
    queryDto: QueryNotificationDto,
  ): Promise<{ data: Notification[]; total: number }> {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (queryDto.user_id) {
      params.push(queryDto.user_id);
      conditions.push(`user_id = $${params.length}`);
    }

    if (queryDto.is_read !== undefined) {
      params.push(queryDto.is_read);
      conditions.push(`is_read = $${params.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count
    const countQuery = `SELECT COUNT(*)::int FROM "notifications" ${whereClause};`;
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
      SELECT * FROM "notifications"
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder};
    `;
    const dataRes = await this.pool.query<Notification>(dataQuery, dataParams);

    return {
      data: dataRes.rows,
      total,
    };
  }

  async findById(id: string): Promise<Notification | null> {
    const query = 'SELECT * FROM "notifications" WHERE id = $1;';
    const res = await this.pool.query<Notification>(query, [id]);
    return res.rows[0] || null;
  }

  async markAsRead(id: string): Promise<boolean> {
    const query =
      'UPDATE "notifications" SET is_read = true WHERE id = $1 AND is_read = false;';
    const res = await this.pool.query(query, [id]);
    return (res.rowCount ?? 0) > 0;
  }

  async markAllAsRead(userId: string): Promise<number> {
    const query =
      'UPDATE "notifications" SET is_read = true WHERE user_id = $1 AND is_read = false;';
    const res = await this.pool.query(query, [userId]);
    return res.rowCount ?? 0;
  }

  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM "notifications" WHERE id = $1;';
    const res = await this.pool.query(query, [id]);
    return (res.rowCount ?? 0) > 0;
  }
}
