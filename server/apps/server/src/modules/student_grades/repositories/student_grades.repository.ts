import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../../database/pg.provider';
import { StudentGrade } from '../entities/student_grade.entity';
import { QueryStudentGradeDto } from '../dto/query_student_grade.dto';

interface DatabaseGradeRow {
  id: string;
  student_id: string;
  semester: string;
  subject_name: string;
  score: string | number;
  created_at: Date;
}

@Injectable()
export class StudentGradesRepository {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  private mapRow(row: DatabaseGradeRow | undefined): StudentGrade | null {
    if (!row) return null;
    return {
      id: row.id,
      student_id: row.student_id,
      semester: row.semester,
      subject_name: row.subject_name,
      score: Number(row.score),
      created_at: row.created_at,
    };
  }

  async create(data: Partial<StudentGrade>): Promise<StudentGrade> {
    const query = `
      INSERT INTO "student_grades" (
        student_id, semester, subject_name, score
      ) VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [
      data.student_id,
      data.semester,
      data.subject_name,
      data.score,
    ];

    const result = await this.pool.query<DatabaseGradeRow>(query, values);
    return this.mapRow(result.rows[0])!;
  }

  async findAll(
    queryDto: QueryStudentGradeDto,
  ): Promise<{ data: StudentGrade[]; total: number }> {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const {
      search,
      student_id,
      semester,
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
      conditions.push(`subject_name ILIKE $${params.length}`);
    }

    if (student_id) {
      params.push(student_id);
      conditions.push(`student_id = $${params.length}`);
    }

    if (semester) {
      params.push(semester);
      conditions.push(`semester = $${params.length}`);
    }

    if (minScore !== undefined) {
      params.push(minScore);
      conditions.push(`score >= $${params.length}`);
    }

    if (maxScore !== undefined) {
      params.push(maxScore);
      conditions.push(`score <= $${params.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const allowedSortColumns = [
      'created_at',
      'semester',
      'subject_name',
      'score',
    ];
    const actualSortBy = allowedSortColumns.includes(sortBy || '')
      ? sortBy
      : 'created_at';
    const actualSortOrder = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    // Get count
    const countQuery = `SELECT COUNT(*)::int FROM "student_grades" ${whereClause};`;
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
      SELECT * FROM "student_grades"
      ${whereClause}
      ORDER BY "${actualSortBy}" ${actualSortOrder}
      LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder};
    `;
    const dataResult = await this.pool.query<DatabaseGradeRow>(
      dataQuery,
      dataParams,
    );

    return {
      data: dataResult.rows.map((row) => this.mapRow(row)!),
      total,
    };
  }

  async count(
    queryDto: Omit<QueryStudentGradeDto, 'page' | 'limit'>,
  ): Promise<number> {
    const { search, student_id, semester, minScore, maxScore } = queryDto;

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`subject_name ILIKE $${params.length}`);
    }

    if (student_id) {
      params.push(student_id);
      conditions.push(`student_id = $${params.length}`);
    }

    if (semester) {
      params.push(semester);
      conditions.push(`semester = $${params.length}`);
    }

    if (minScore !== undefined) {
      params.push(minScore);
      conditions.push(`score >= $${params.length}`);
    }

    if (maxScore !== undefined) {
      params.push(maxScore);
      conditions.push(`score <= $${params.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const countQuery = `SELECT COUNT(*)::int FROM "student_grades" ${whereClause};`;
    const countResult = await this.pool.query<{ count: number }>(
      countQuery,
      params,
    );
    return countResult.rows[0].count;
  }

  async findById(id: string): Promise<StudentGrade | null> {
    const query = 'SELECT * FROM "student_grades" WHERE id = $1;';
    const res = await this.pool.query<DatabaseGradeRow>(query, [id]);
    return this.mapRow(res.rows[0]);
  }

  async findByUniqueKey(
    studentId: string,
    semester: string,
    subjectName: string,
  ): Promise<StudentGrade | null> {
    const query = `
      SELECT * FROM "student_grades" 
      WHERE student_id = $1 AND semester = $2 AND subject_name = $3;
    `;
    const res = await this.pool.query<DatabaseGradeRow>(query, [
      studentId,
      semester,
      subjectName,
    ]);
    return this.mapRow(res.rows[0]);
  }

  async update(
    id: string,
    updateData: Partial<StudentGrade>,
  ): Promise<StudentGrade | null> {
    const fields = Object.keys(updateData).filter(
      (key) => updateData[key as keyof StudentGrade] !== undefined,
    );
    if (fields.length === 0) {
      return this.findById(id);
    }

    const setClauses: string[] = [];
    const params: unknown[] = [id];

    fields.forEach((field) => {
      params.push(updateData[field as keyof StudentGrade]);
      setClauses.push(`"${field}" = $${params.length}`);
    });

    const query = `
      UPDATE "student_grades"
      SET ${setClauses.join(', ')}
      WHERE id = $1
      RETURNING *;
    `;
    const res = await this.pool.query<DatabaseGradeRow>(query, params);
    return this.mapRow(res.rows[0]);
  }

  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM "student_grades" WHERE id = $1;';
    const res = await this.pool.query(query, [id]);
    return (res.rowCount ?? 0) > 0;
  }
}
