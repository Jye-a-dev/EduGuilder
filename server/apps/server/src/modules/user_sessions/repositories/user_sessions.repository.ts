import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../../database/pg.provider';
import { UserSession } from '../entities/user_session.entity';
import { QueryUserSessionDto } from '../dto/query_user_session.dto';

@Injectable()
export class UserSessionsRepository {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  async create(data: {
    user_id: string;
    refresh_token_hash: string;
    user_agent?: string | null;
    ip_address?: string | null;
    expires_at: Date;
  }): Promise<UserSession> {
    const query = `
      INSERT INTO "user_sessions" (
        user_id, refresh_token_hash, user_agent, ip_address, expires_at
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [
      data.user_id,
      data.refresh_token_hash,
      data.user_agent || null,
      data.ip_address || null,
      data.expires_at,
    ];
    const result = await this.pool.query<UserSession>(query, values);
    return result.rows[0];
  }

  async findAll(
    queryDto: QueryUserSessionDto,
  ): Promise<{ data: UserSession[]; total: number }> {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const { user_id, activeOnly } = queryDto;
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (user_id) {
      params.push(user_id);
      conditions.push(`user_id = $${params.length}`);
    }

    if (activeOnly) {
      conditions.push('is_revoked = false');
      conditions.push('expires_at > NOW()');
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*)::int FROM "user_sessions" ${whereClause};`;
    const countResult = await this.pool.query<{ count: number }>(
      countQuery,
      params,
    );
    const total = countResult.rows[0].count;

    const dataParams = [...params];
    dataParams.push(limit);
    const limitPlaceholder = `$${dataParams.length}`;
    dataParams.push(offset);
    const offsetPlaceholder = `$${dataParams.length}`;

    const dataQuery = `
      SELECT * FROM "user_sessions"
      ${whereClause}
      ORDER BY "created_at" DESC
      LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder};
    `;
    const dataResult = await this.pool.query<UserSession>(
      dataQuery,
      dataParams,
    );

    return {
      data: dataResult.rows,
      total,
    };
  }

  async findById(id: string): Promise<UserSession | null> {
    const query = 'SELECT * FROM "user_sessions" WHERE id = $1;';
    const res = await this.pool.query<UserSession>(query, [id]);
    return res.rows[0] || null;
  }

  async findByRefreshTokenHash(
    refreshTokenHash: string,
  ): Promise<UserSession | null> {
    const query =
      'SELECT * FROM "user_sessions" WHERE refresh_token_hash = $1;';
    const res = await this.pool.query<UserSession>(query, [refreshTokenHash]);
    return res.rows[0] || null;
  }

  async revoke(id: string): Promise<boolean> {
    const query = `
      UPDATE "user_sessions"
      SET is_revoked = true
      WHERE id = $1 AND is_revoked = false;
    `;
    const res = await this.pool.query(query, [id]);
    return (res.rowCount ?? 0) > 0;
  }

  async revokeAllByUserId(userId: string): Promise<number> {
    const query = `
      UPDATE "user_sessions"
      SET is_revoked = true
      WHERE user_id = $1 AND is_revoked = false;
    `;
    const res = await this.pool.query(query, [userId]);
    return res.rowCount ?? 0;
  }

  async deleteExpired(): Promise<number> {
    const query =
      'DELETE FROM "user_sessions" WHERE expires_at < NOW() OR is_revoked = true;';
    const res = await this.pool.query(query);
    return res.rowCount ?? 0;
  }
}
