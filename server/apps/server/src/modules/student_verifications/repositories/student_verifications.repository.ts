import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../../database/pg.provider';
import { StudentVerification } from '../entities/student_verification.entity';
import { QueryStudentVerificationDto } from '../dto/query_student_verification.dto';
import { VerifyStatus } from '../interfaces/student_verification.interface';

interface DatabaseVerificationRow {
  id: string;
  student_id: string;
  card_image_key: string;
  status: VerifyStatus;
  reject_reason: string | null;
  verified_by: string | null;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class StudentVerificationsRepository {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  private mapRow(
    row: DatabaseVerificationRow | undefined,
  ): StudentVerification | null {
    if (!row) return null;
    return {
      id: row.id,
      student_id: row.student_id,
      card_image_key: row.card_image_key,
      status: row.status,
      reject_reason: row.reject_reason,
      verified_by: row.verified_by,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  async create(
    data: Partial<StudentVerification>,
  ): Promise<StudentVerification> {
    const query = `
      INSERT INTO "student_verifications" (
        student_id, card_image_key, status, reject_reason, verified_by
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [
      data.student_id,
      data.card_image_key,
      data.status || VerifyStatus.PENDING,
      data.reject_reason || null,
      data.verified_by || null,
    ];

    const result = await this.pool.query<DatabaseVerificationRow>(
      query,
      values,
    );
    return this.mapRow(result.rows[0])!;
  }

  async findAll(
    queryDto: QueryStudentVerificationDto,
  ): Promise<{ data: StudentVerification[]; total: number }> {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const { student_id, status, verified_by, sortBy, sortOrder } = queryDto;
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (student_id) {
      params.push(student_id);
      conditions.push(`student_id = $${params.length}`);
    }

    if (status) {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }

    if (verified_by) {
      params.push(verified_by);
      conditions.push(`verified_by = $${params.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const allowedSortColumns = ['created_at', 'updated_at', 'status'];
    const actualSortBy = allowedSortColumns.includes(sortBy || '')
      ? sortBy
      : 'created_at';
    const actualSortOrder = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    // Get count
    const countQuery = `SELECT COUNT(*)::int FROM "student_verifications" ${whereClause};`;
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
      SELECT * FROM "student_verifications"
      ${whereClause}
      ORDER BY "${actualSortBy}" ${actualSortOrder}
      LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder};
    `;
    const dataResult = await this.pool.query<DatabaseVerificationRow>(
      dataQuery,
      dataParams,
    );

    return {
      data: dataResult.rows.map((row) => this.mapRow(row)!),
      total,
    };
  }

  async count(
    queryDto: Omit<QueryStudentVerificationDto, 'page' | 'limit'>,
  ): Promise<number> {
    const { student_id, status, verified_by } = queryDto;

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (student_id) {
      params.push(student_id);
      conditions.push(`student_id = $${params.length}`);
    }

    if (status) {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }

    if (verified_by) {
      params.push(verified_by);
      conditions.push(`verified_by = $${params.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const countQuery = `SELECT COUNT(*)::int FROM "student_verifications" ${whereClause};`;
    const countResult = await this.pool.query<{ count: number }>(
      countQuery,
      params,
    );
    return countResult.rows[0].count;
  }

  async findById(id: string): Promise<StudentVerification | null> {
    const query = 'SELECT * FROM "student_verifications" WHERE id = $1;';
    const res = await this.pool.query<DatabaseVerificationRow>(query, [id]);
    return this.mapRow(res.rows[0]);
  }

  async update(
    id: string,
    updateData: Partial<StudentVerification>,
  ): Promise<StudentVerification | null> {
    const fields = Object.keys(updateData).filter(
      (key) => updateData[key as keyof StudentVerification] !== undefined,
    );
    if (fields.length === 0) {
      return this.findById(id);
    }

    const setClauses: string[] = [];
    const params: unknown[] = [id];

    fields.forEach((field) => {
      params.push(updateData[field as keyof StudentVerification]);
      setClauses.push(`"${field}" = $${params.length}`);
    });

    const query = `
      UPDATE "student_verifications"
      SET ${setClauses.join(', ')}
      WHERE id = $1
      RETURNING *;
    `;
    const res = await this.pool.query<DatabaseVerificationRow>(query, params);
    return this.mapRow(res.rows[0]);
  }

  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM "student_verifications" WHERE id = $1;';
    const res = await this.pool.query(query, [id]);
    return (res.rowCount ?? 0) > 0;
  }
}
