import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../../database/pg.provider';
import { UniversityAdmission } from '../entities/university_admission.entity';
import { QueryUniversityAdmissionDto } from '../dto/query_university_admission.dto';

interface DatabaseAdmissionRow {
  id: string;
  university_id: string;
  year: number;
  major_code: string;
  major_name: string;
  quota: number;
  benchmark_score: string | number;
  group_code: string;
  created_at: Date;
}

@Injectable()
export class UniversityAdmissionsRepository {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  private mapRow(
    row: DatabaseAdmissionRow | undefined,
  ): UniversityAdmission | null {
    if (!row) return null;
    return {
      id: row.id,
      university_id: row.university_id,
      year: Number(row.year),
      major_code: row.major_code,
      major_name: row.major_name,
      quota: Number(row.quota),
      benchmark_score: Number(row.benchmark_score),
      group_code: row.group_code,
      created_at: row.created_at,
    };
  }

  async create(
    data: Partial<UniversityAdmission>,
  ): Promise<UniversityAdmission> {
    const query = `
      INSERT INTO "university_admissions" (
        university_id, year, major_code, major_name, quota, benchmark_score, group_code
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [
      data.university_id,
      data.year,
      data.major_code,
      data.major_name,
      data.quota ?? 0,
      data.benchmark_score,
      data.group_code,
    ];

    const result = await this.pool.query<DatabaseAdmissionRow>(query, values);
    return this.mapRow(result.rows[0])!;
  }

  async findAll(
    queryDto: QueryUniversityAdmissionDto,
  ): Promise<{ data: UniversityAdmission[]; total: number }> {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const {
      search,
      university_id,
      year,
      group_code,
      minScore,
      maxScore,
      sortBy,
      sortOrder,
    } = queryDto;
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(
        `(major_code ILIKE $${params.length} OR major_name ILIKE $${params.length})`,
      );
    }

    if (university_id) {
      params.push(university_id);
      conditions.push(`university_id = $${params.length}`);
    }

    if (year !== undefined) {
      params.push(year);
      conditions.push(`year = $${params.length}`);
    }

    if (group_code) {
      params.push(group_code);
      conditions.push(`group_code = $${params.length}`);
    }

    if (minScore !== undefined) {
      params.push(minScore);
      conditions.push(`benchmark_score >= $${params.length}`);
    }

    if (maxScore !== undefined) {
      params.push(maxScore);
      conditions.push(`benchmark_score <= $${params.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const allowedSortColumns = [
      'created_at',
      'year',
      'quota',
      'benchmark_score',
      'major_name',
      'major_code',
    ];
    const actualSortBy = allowedSortColumns.includes(sortBy || '')
      ? sortBy
      : 'created_at';
    const actualSortOrder = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    // Get count
    const countQuery = `SELECT COUNT(*)::int FROM "university_admissions" ${whereClause};`;
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
      SELECT * FROM "university_admissions"
      ${whereClause}
      ORDER BY "${actualSortBy}" ${actualSortOrder}
      LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder};
    `;
    const dataResult = await this.pool.query<DatabaseAdmissionRow>(
      dataQuery,
      dataParams,
    );

    return {
      data: dataResult.rows.map((row) => this.mapRow(row)!),
      total,
    };
  }

  async count(
    queryDto: Omit<QueryUniversityAdmissionDto, 'page' | 'limit'>,
  ): Promise<number> {
    const { search, university_id, year, group_code, minScore, maxScore } =
      queryDto;

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(
        `(major_code ILIKE $${params.length} OR major_name ILIKE $${params.length})`,
      );
    }

    if (university_id) {
      params.push(university_id);
      conditions.push(`university_id = $${params.length}`);
    }

    if (year !== undefined) {
      params.push(year);
      conditions.push(`year = $${params.length}`);
    }

    if (group_code) {
      params.push(group_code);
      conditions.push(`group_code = $${params.length}`);
    }

    if (minScore !== undefined) {
      params.push(minScore);
      conditions.push(`benchmark_score >= $${params.length}`);
    }

    if (maxScore !== undefined) {
      params.push(maxScore);
      conditions.push(`benchmark_score <= $${params.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const countQuery = `SELECT COUNT(*)::int FROM "university_admissions" ${whereClause};`;
    const countResult = await this.pool.query<{ count: number }>(
      countQuery,
      params,
    );
    return countResult.rows[0].count;
  }

  async findById(id: string): Promise<UniversityAdmission | null> {
    const query = 'SELECT * FROM "university_admissions" WHERE id = $1;';
    const res = await this.pool.query<DatabaseAdmissionRow>(query, [id]);
    return this.mapRow(res.rows[0]);
  }

  async findByUniqueKey(
    universityId: string,
    year: number,
    majorCode: string,
    groupCode: string,
  ): Promise<UniversityAdmission | null> {
    const query = `
      SELECT * FROM "university_admissions" 
      WHERE university_id = $1 AND year = $2 AND major_code = $3 AND group_code = $4;
    `;
    const res = await this.pool.query<DatabaseAdmissionRow>(query, [
      universityId,
      year,
      majorCode,
      groupCode,
    ]);
    return this.mapRow(res.rows[0]);
  }

  async update(
    id: string,
    updateData: Partial<UniversityAdmission>,
  ): Promise<UniversityAdmission | null> {
    const fields = Object.keys(updateData).filter(
      (key) => updateData[key as keyof UniversityAdmission] !== undefined,
    );
    if (fields.length === 0) {
      return this.findById(id);
    }

    const setClauses: string[] = [];
    const params: unknown[] = [id];

    fields.forEach((field) => {
      params.push(updateData[field as keyof UniversityAdmission]);
      setClauses.push(`"${field}" = $${params.length}`);
    });

    const query = `
      UPDATE "university_admissions"
      SET ${setClauses.join(', ')}
      WHERE id = $1
      RETURNING *;
    `;
    const res = await this.pool.query<DatabaseAdmissionRow>(query, params);
    return this.mapRow(res.rows[0]);
  }

  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM "university_admissions" WHERE id = $1;';
    const res = await this.pool.query(query, [id]);
    return (res.rowCount ?? 0) > 0;
  }
}
