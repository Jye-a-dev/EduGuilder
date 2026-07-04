import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../../database/pg.provider';
import { User } from '../entities/user.entity';
import { QueryUserDto } from '../dto/query_user.dto';

@Injectable()
export class UsersRepository {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  async create(userData: Partial<User>): Promise<User> {
    const query = `
      INSERT INTO "users" (
        email, password_hash, full_name, role, university_id, current_grade, eco_points
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [
      userData.email,
      userData.password_hash || null,
      userData.full_name,
      userData.role || 'student',
      userData.university_id || null,
      userData.current_grade || null,
      userData.eco_points ?? 0,
    ];

    const result = await this.pool.query<User>(query, values);
    return result.rows[0];
  }

  async findAll(
    queryDto: QueryUserDto,
  ): Promise<{ data: User[]; total: number }> {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const search = queryDto.search;
    const role = queryDto.role;
    const university_id = queryDto.university_id;
    const includeDeleted = queryDto.includeDeleted || false;
    const sortBy = queryDto.sortBy || 'created_at';
    const sortOrder = queryDto.sortOrder || 'DESC';

    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (!includeDeleted) {
      conditions.push('deleted_at IS NULL');
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(
        `(email ILIKE $${params.length} OR full_name ILIKE $${params.length})`,
      );
    }

    if (role) {
      params.push(role);
      conditions.push(`role = $${params.length}`);
    }

    if (university_id) {
      params.push(university_id);
      conditions.push(`university_id = $${params.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const allowedSortColumns = [
      'created_at',
      'updated_at',
      'full_name',
      'email',
      'eco_points',
      'role',
      'current_grade',
    ];
    const actualSortBy = allowedSortColumns.includes(sortBy)
      ? sortBy
      : 'created_at';
    const actualSortOrder = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    // Get total count
    const countQuery = `SELECT COUNT(*)::int FROM "users" ${whereClause};`;
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
      SELECT * FROM "users"
      ${whereClause}
      ORDER BY "${actualSortBy}" ${actualSortOrder}
      LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder};
    `;
    const dataResult = await this.pool.query<User>(dataQuery, dataParams);

    return {
      data: dataResult.rows,
      total,
    };
  }

  async count(queryDto: Omit<QueryUserDto, 'page' | 'limit'>): Promise<number> {
    const { search, role, university_id, includeDeleted } = queryDto;

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (!includeDeleted) {
      conditions.push('deleted_at IS NULL');
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(
        `(email ILIKE $${params.length} OR full_name ILIKE $${params.length})`,
      );
    }

    if (role) {
      params.push(role);
      conditions.push(`role = $${params.length}`);
    }

    if (university_id) {
      params.push(university_id);
      conditions.push(`university_id = $${params.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const countQuery = `SELECT COUNT(*)::int FROM "users" ${whereClause};`;
    const countResult = await this.pool.query<{ count: number }>(
      countQuery,
      params,
    );
    return countResult.rows[0].count;
  }

  async findById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM "users" WHERE id = $1;';
    const res = await this.pool.query<User>(query, [id]);
    return res.rows[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM "users" WHERE email = $1;';
    const res = await this.pool.query<User>(query, [email]);
    return res.rows[0] || null;
  }

  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    const fields = Object.keys(updateData).filter(
      (key) => updateData[key as keyof User] !== undefined,
    );
    if (fields.length === 0) {
      return this.findById(id);
    }

    const setClauses: string[] = [];
    const params: unknown[] = [id];

    fields.forEach((field) => {
      params.push(updateData[field as keyof User]);
      setClauses.push(`"${field}" = $${params.length}`);
    });

    const query = `
      UPDATE "users"
      SET ${setClauses.join(', ')}
      WHERE id = $1
      RETURNING *;
    `;
    const res = await this.pool.query<User>(query, params);
    return res.rows[0] || null;
  }

  async softDelete(id: string): Promise<boolean> {
    const query = `
      UPDATE "users"
      SET deleted_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL;
    `;
    const res = await this.pool.query<User>(query, [id]);
    return (res.rowCount ?? 0) > 0;
  }

  async restore(id: string): Promise<boolean> {
    const query = `
      UPDATE "users"
      SET deleted_at = NULL
      WHERE id = $1 AND deleted_at IS NOT NULL;
    `;
    const res = await this.pool.query<User>(query, [id]);
    return (res.rowCount ?? 0) > 0;
  }

  async hardDelete(id: string): Promise<boolean> {
    const query = 'DELETE FROM "users" WHERE id = $1;';
    const res = await this.pool.query<User>(query, [id]);
    return (res.rowCount ?? 0) > 0;
  }
}
