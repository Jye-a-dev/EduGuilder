import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../../database/pg.provider';
import { PasswordResetToken } from '../entities/password_reset_token.entity';
import { QueryPasswordResetTokenDto } from '../dto/query_password_reset_token.dto';

@Injectable()
export class PasswordResetTokensRepository {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  async create(data: {
    user_id: string;
    token_hash: string;
    expires_at: Date;
  }): Promise<PasswordResetToken> {
    const query = `
      INSERT INTO "password_reset_tokens" (
        user_id, token_hash, expires_at
      ) VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [data.user_id, data.token_hash, data.expires_at];
    const result = await this.pool.query<PasswordResetToken>(query, values);
    return result.rows[0];
  }

  async findAll(
    queryDto: QueryPasswordResetTokenDto,
  ): Promise<{ data: PasswordResetToken[]; total: number }> {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const { user_id, unusedOnly } = queryDto;
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (user_id) {
      params.push(user_id);
      conditions.push(`user_id = $${params.length}`);
    }

    if (unusedOnly) {
      conditions.push('used_at IS NULL');
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*)::int FROM "password_reset_tokens" ${whereClause};`;
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
      SELECT * FROM "password_reset_tokens"
      ${whereClause}
      ORDER BY "created_at" DESC
      LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder};
    `;
    const dataResult = await this.pool.query<PasswordResetToken>(
      dataQuery,
      dataParams,
    );

    return {
      data: dataResult.rows,
      total,
    };
  }

  async findById(id: string): Promise<PasswordResetToken | null> {
    const query = 'SELECT * FROM "password_reset_tokens" WHERE id = $1;';
    const res = await this.pool.query<PasswordResetToken>(query, [id]);
    return res.rows[0] || null;
  }

  async findByTokenHash(tokenHash: string): Promise<PasswordResetToken | null> {
    const query =
      'SELECT * FROM "password_reset_tokens" WHERE token_hash = $1;';
    const res = await this.pool.query<PasswordResetToken>(query, [tokenHash]);
    return res.rows[0] || null;
  }

  async markAsUsed(id: string): Promise<boolean> {
    const query = `
      UPDATE "password_reset_tokens"
      SET used_at = NOW()
      WHERE id = $1 AND used_at IS NULL;
    `;
    const res = await this.pool.query(query, [id]);
    return (res.rowCount ?? 0) > 0;
  }

  async deleteExpired(): Promise<number> {
    const query =
      'DELETE FROM "password_reset_tokens" WHERE expires_at < NOW();';
    const res = await this.pool.query(query);
    return res.rowCount ?? 0;
  }

  async deleteByUserId(userId: string): Promise<number> {
    const query = 'DELETE FROM "password_reset_tokens" WHERE user_id = $1;';
    const res = await this.pool.query(query, [userId]);
    return res.rowCount ?? 0;
  }
}
