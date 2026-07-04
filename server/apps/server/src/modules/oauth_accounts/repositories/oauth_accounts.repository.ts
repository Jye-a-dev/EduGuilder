import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../../database/pg.provider';
import { OAuthAccount } from '../entities/oauth_account.entity';
import { QueryOAuthAccountDto } from '../dto/query_oauth_account.dto';

@Injectable()
export class OAuthAccountsRepository {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  async create(data: Partial<OAuthAccount>): Promise<OAuthAccount> {
    const query = `
      INSERT INTO "oauth_accounts" (
        user_id, provider, provider_user_id, meta_data
      ) VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [
      data.user_id,
      data.provider,
      data.provider_user_id,
      JSON.stringify(data.meta_data || {}),
    ];
    const result = await this.pool.query<OAuthAccount>(query, values);
    return result.rows[0];
  }

  async findAll(
    queryDto: QueryOAuthAccountDto,
  ): Promise<{ data: OAuthAccount[]; total: number }> {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const { user_id, provider, sortBy, sortOrder } = queryDto;
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (user_id) {
      params.push(user_id);
      conditions.push(`user_id = $${params.length}`);
    }

    if (provider) {
      params.push(provider);
      conditions.push(`provider = $${params.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const allowedSortColumns = ['created_at'];
    const actualSortBy = allowedSortColumns.includes(sortBy || '')
      ? sortBy
      : 'created_at';
    const actualSortOrder = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    const countQuery = `SELECT COUNT(*)::int FROM "oauth_accounts" ${whereClause};`;
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
      SELECT * FROM "oauth_accounts"
      ${whereClause}
      ORDER BY "${actualSortBy}" ${actualSortOrder}
      LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder};
    `;
    const dataResult = await this.pool.query<OAuthAccount>(
      dataQuery,
      dataParams,
    );

    return {
      data: dataResult.rows,
      total,
    };
  }

  async findById(id: string): Promise<OAuthAccount | null> {
    const query = 'SELECT * FROM "oauth_accounts" WHERE id = $1;';
    const res = await this.pool.query<OAuthAccount>(query, [id]);
    return res.rows[0] || null;
  }

  async findByProvider(
    provider: string,
    providerUserId: string,
  ): Promise<OAuthAccount | null> {
    const query =
      'SELECT * FROM "oauth_accounts" WHERE provider = $1 AND provider_user_id = $2;';
    const res = await this.pool.query<OAuthAccount>(query, [
      provider,
      providerUserId,
    ]);
    return res.rows[0] || null;
  }

  async findByUserId(userId: string): Promise<OAuthAccount[]> {
    const query = 'SELECT * FROM "oauth_accounts" WHERE user_id = $1;';
    const res = await this.pool.query<OAuthAccount>(query, [userId]);
    return res.rows;
  }

  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM "oauth_accounts" WHERE id = $1;';
    const res = await this.pool.query(query, [id]);
    return (res.rowCount ?? 0) > 0;
  }

  async deleteByUserId(userId: string): Promise<number> {
    const query = 'DELETE FROM "oauth_accounts" WHERE user_id = $1;';
    const res = await this.pool.query(query, [userId]);
    return res.rowCount ?? 0;
  }
}
