import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../../database/pg.provider';
import { UniversityReview } from '../entities/university_review.entity';
import { QueryUniversityReviewDto } from '../dto/query_university_review.dto';

@Injectable()
export class UniversityReviewsRepository {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  async create(data: Partial<UniversityReview>): Promise<UniversityReview> {
    const query = `
      INSERT INTO "university_reviews" (
        university_id, reviewer_id, rating_stars, comment, official_reply, is_approved
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      data.university_id,
      data.reviewer_id,
      data.rating_stars,
      data.comment,
      data.official_reply || null,
      data.is_approved ?? false,
    ];
    const res = await this.pool.query<UniversityReview>(query, values);
    return res.rows[0];
  }

  async findAll(
    queryDto: QueryUniversityReviewDto,
  ): Promise<{ data: UniversityReview[]; total: number }> {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (!queryDto.includeDeleted) {
      conditions.push('deleted_at IS NULL');
    }

    if (queryDto.university_id) {
      params.push(queryDto.university_id);
      conditions.push(`university_id = $${params.length}`);
    }

    if (queryDto.reviewer_id) {
      params.push(queryDto.reviewer_id);
      conditions.push(`reviewer_id = $${params.length}`);
    }

    if (queryDto.is_approved !== undefined) {
      params.push(queryDto.is_approved);
      conditions.push(`is_approved = $${params.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const allowedSort = ['created_at', 'updated_at', 'rating_stars'];
    const sortBy = queryDto.sortBy || 'created_at';
    const sortOrder = queryDto.sortOrder || 'DESC';
    const actualSortBy = allowedSort.includes(sortBy) ? sortBy : 'created_at';
    const actualSortOrder = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    // Count
    const countQuery = `SELECT COUNT(*)::int FROM "university_reviews" ${whereClause};`;
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
      SELECT * FROM "university_reviews"
      ${whereClause}
      ORDER BY "${actualSortBy}" ${actualSortOrder}
      LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder};
    `;
    const dataRes = await this.pool.query<UniversityReview>(
      dataQuery,
      dataParams,
    );

    return {
      data: dataRes.rows,
      total,
    };
  }

  async findById(id: string): Promise<UniversityReview | null> {
    const query = 'SELECT * FROM "university_reviews" WHERE id = $1;';
    const res = await this.pool.query<UniversityReview>(query, [id]);
    return res.rows[0] || null;
  }

  async update(
    id: string,
    updateData: Partial<UniversityReview>,
  ): Promise<UniversityReview | null> {
    const fields = Object.keys(updateData).filter(
      (key) => updateData[key as keyof UniversityReview] !== undefined,
    );
    if (fields.length === 0) {
      return this.findById(id);
    }

    const setClauses: string[] = [];
    const params: any[] = [id];

    fields.forEach((field) => {
      params.push(updateData[field as keyof UniversityReview]);
      setClauses.push(`"${field}" = $${params.length}`);
    });

    const query = `
      UPDATE "university_reviews"
      SET ${setClauses.join(', ')}
      WHERE id = $1
      RETURNING *;
    `;
    const res = await this.pool.query<UniversityReview>(query, params);
    return res.rows[0] || null;
  }

  async softDelete(id: string): Promise<boolean> {
    const query =
      'UPDATE "university_reviews" SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL;';
    const res = await this.pool.query(query, [id]);
    return (res.rowCount ?? 0) > 0;
  }

  async restore(id: string): Promise<boolean> {
    const query =
      'UPDATE "university_reviews" SET deleted_at = NULL WHERE id = $1 AND deleted_at IS NOT NULL;';
    const res = await this.pool.query(query, [id]);
    return (res.rowCount ?? 0) > 0;
  }

  async hardDelete(id: string): Promise<boolean> {
    const query = 'DELETE FROM "university_reviews" WHERE id = $1;';
    const res = await this.pool.query(query, [id]);
    return (res.rowCount ?? 0) > 0;
  }
}
