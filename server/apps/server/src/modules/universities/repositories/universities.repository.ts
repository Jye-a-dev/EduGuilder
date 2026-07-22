import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../../database/pg.provider';
import { University } from '../entities/university.entity';
import { QueryUniversityDto } from '../dto/query_university.dto';

@Injectable()
export class UniversitiesRepository {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  async create(data: Partial<University>): Promise<University> {
    const query = `
      INSERT INTO "universities" (
        code, name, region, logo_storage_key, tuition_fees, is_verified, website_url, type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [
      data.code,
      data.name,
      data.region || null,
      data.logo_storage_key || null,
      data.tuition_fees || null,
      data.is_verified ?? false,
      data.website_url || null,
      data.type || null,
    ];

    const result = await this.pool.query<University>(query, values);
    return result.rows[0];
  }

  async findAll(
    queryDto: QueryUniversityDto,
  ): Promise<{ data: University[]; total: number }> {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const { search, is_verified, includeDeleted, sortBy, sortOrder } = queryDto;
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (!includeDeleted) {
      conditions.push('deleted_at IS NULL');
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(
        `(code ILIKE $${params.length} OR name ILIKE $${params.length})`,
      );
    }

    if (is_verified !== undefined) {
      params.push(is_verified);
      conditions.push(`is_verified = $${params.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const allowedSortColumns = [
      'created_at',
      'updated_at',
      'name',
      'code',
      'is_verified',
    ];
    const actualSortBy = allowedSortColumns.includes(sortBy || '')
      ? sortBy
      : 'created_at';
    const actualSortOrder = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    // Get count
    const countQuery = `SELECT COUNT(*)::int FROM "universities" ${whereClause};`;
    const countResult = await this.pool.query<{ count: number }>(
      countQuery,
      params,
    );
    const total = countResult.rows[0].count;

    // Get paginated data
    const dataParams = [...params];
    dataParams.push(limit);
    const limitPlaceholder = `$${dataParams.length}`;
    dataParams.push(offset);
    const offsetPlaceholder = `$${dataParams.length}`;

    const dataQuery = `
      SELECT * FROM "universities"
      ${whereClause}
      ORDER BY "${actualSortBy}" ${actualSortOrder}
      LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder};
    `;
    const dataResult = await this.pool.query<University>(dataQuery, dataParams);

    return {
      data: dataResult.rows,
      total,
    };
  }

  async count(
    queryDto: Omit<QueryUniversityDto, 'page' | 'limit'>,
  ): Promise<number> {
    const { search, is_verified, includeDeleted } = queryDto;

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (!includeDeleted) {
      conditions.push('deleted_at IS NULL');
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(
        `(code ILIKE $${params.length} OR name ILIKE $${params.length})`,
      );
    }

    if (is_verified !== undefined) {
      params.push(is_verified);
      conditions.push(`is_verified = $${params.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const countQuery = `SELECT COUNT(*)::int FROM "universities" ${whereClause};`;
    const countResult = await this.pool.query<{ count: number }>(
      countQuery,
      params,
    );
    return countResult.rows[0].count;
  }

  async findById(id: string): Promise<University | null> {
    const query = 'SELECT * FROM "universities" WHERE id = $1;';
    const res = await this.pool.query<University>(query, [id]);
    return res.rows[0] || null;
  }

  async findByCode(code: string): Promise<University | null> {
    const query = 'SELECT * FROM "universities" WHERE code = $1;';
    const res = await this.pool.query<University>(query, [code]);
    return res.rows[0] || null;
  }

  async update(
    id: string,
    updateData: Partial<University>,
  ): Promise<University | null> {
    const fields = Object.keys(updateData).filter(
      (key) => updateData[key as keyof University] !== undefined,
    );
    if (fields.length === 0) {
      return this.findById(id);
    }

    const setClauses: string[] = [];
    const params: unknown[] = [id];

    fields.forEach((field) => {
      params.push(updateData[field as keyof University]);
      setClauses.push(`"${field}" = $${params.length}`);
    });

    const query = `
      UPDATE "universities"
      SET ${setClauses.join(', ')}
      WHERE id = $1
      RETURNING *;
    `;
    const res = await this.pool.query<University>(query, params);
    return res.rows[0] || null;
  }

  async softDelete(id: string): Promise<boolean> {
    const query = `
      UPDATE "universities"
      SET deleted_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL;
    `;
    const res = await this.pool.query(query, [id]);
    return (res.rowCount ?? 0) > 0;
  }

  async restore(id: string): Promise<boolean> {
    const query = `
      UPDATE "universities"
      SET deleted_at = NULL
      WHERE id = $1 AND deleted_at IS NOT NULL;
    `;
    const res = await this.pool.query(query, [id]);
    return (res.rowCount ?? 0) > 0;
  }

  async hardDelete(id: string): Promise<boolean> {
    const query = 'DELETE FROM "universities" WHERE id = $1;';
    const res = await this.pool.query(query, [id]);
    return (res.rowCount ?? 0) > 0;
  }
}
