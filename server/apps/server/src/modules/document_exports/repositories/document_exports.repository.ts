import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../../database/pg.provider';
import { DocumentExport } from '../entities/document_export.entity';
import { QueryDocumentExportDto } from '../dto/query_document_export.dto';

@Injectable()
export class DocumentExportsRepository {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  async create(data: Partial<DocumentExport>): Promise<DocumentExport> {
    const query = `
      INSERT INTO "document_exports" (
        student_id, source_note_id, format, storage_key, file_size_bytes, status, render_settings
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [
      data.student_id,
      data.source_note_id || null,
      data.format,
      data.storage_key,
      data.file_size_bytes || null,
      data.status || 'completed',
      data.render_settings ? JSON.stringify(data.render_settings) : null,
    ];
    const res = await this.pool.query<DocumentExport>(query, values);
    return res.rows[0];
  }

  async findAll(
    queryDto: QueryDocumentExportDto,
  ): Promise<{ data: DocumentExport[]; total: number }> {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (queryDto.student_id) {
      params.push(queryDto.student_id);
      conditions.push(`student_id = $${params.length}`);
    }

    if (queryDto.status) {
      params.push(queryDto.status);
      conditions.push(`status = $${params.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count
    const countQuery = `SELECT COUNT(*)::int FROM "document_exports" ${whereClause};`;
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
      SELECT * FROM "document_exports"
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder};
    `;
    const dataRes = await this.pool.query<DocumentExport>(
      dataQuery,
      dataParams,
    );

    return {
      data: dataRes.rows,
      total,
    };
  }

  async findById(id: string): Promise<DocumentExport | null> {
    const query = 'SELECT * FROM "document_exports" WHERE id = $1;';
    const res = await this.pool.query<DocumentExport>(query, [id]);
    return res.rows[0] || null;
  }

  async update(
    id: string,
    updateData: Partial<DocumentExport>,
  ): Promise<DocumentExport | null> {
    const fields = Object.keys(updateData).filter(
      (key) => updateData[key as keyof DocumentExport] !== undefined,
    );
    if (fields.length === 0) {
      return this.findById(id);
    }

    const setClauses: string[] = [];
    const params: any[] = [id];

    fields.forEach((field) => {
      params.push(updateData[field as keyof DocumentExport]);
      setClauses.push(`"${field}" = $${params.length}`);
    });

    const query = `
      UPDATE "document_exports"
      SET ${setClauses.join(', ')}
      WHERE id = $1
      RETURNING *;
    `;
    const res = await this.pool.query<DocumentExport>(query, params);
    return res.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM "document_exports" WHERE id = $1;';
    const res = await this.pool.query(query, [id]);
    return (res.rowCount ?? 0) > 0;
  }
}
