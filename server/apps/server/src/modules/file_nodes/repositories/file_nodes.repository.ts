import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../../database/pg.provider';
import { FileNode } from '../entities/file_node.entity';
import { QueryFileNodeDto } from '../dto/query_file_node.dto';

@Injectable()
export class FileNodesRepository {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  async create(data: Partial<FileNode>): Promise<FileNode> {
    const query = `
      INSERT INTO "file_nodes" (
        student_id, name, is_folder, parent_id, note_id, sort_order
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      data.student_id,
      data.name,
      data.is_folder ?? false,
      data.parent_id || null,
      data.note_id || null,
      data.sort_order ?? 0,
    ];
    const res = await this.pool.query<FileNode>(query, values);
    return res.rows[0];
  }

  async findAll(queryDto: QueryFileNodeDto): Promise<FileNode[]> {
    const conditions: string[] = [];
    const params: any[] = [];

    if (queryDto.student_id) {
      params.push(queryDto.student_id);
      conditions.push(`student_id = $${params.length}`);
    }

    if (queryDto.parent_id !== undefined) {
      if (queryDto.parent_id === 'null' || !queryDto.parent_id) {
        conditions.push(`parent_id IS NULL`);
      } else {
        params.push(queryDto.parent_id);
        conditions.push(`parent_id = $${params.length}`);
      }
    }

    if (queryDto.search) {
      params.push(`%${queryDto.search}%`);
      conditions.push(`name ILIKE $${params.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `
      SELECT * FROM "file_nodes"
      ${whereClause}
      ORDER BY is_folder DESC, sort_order ASC, name ASC;
    `;
    const res = await this.pool.query<FileNode>(query, params);
    return res.rows;
  }

  async findById(id: string): Promise<FileNode | null> {
    const query = 'SELECT * FROM "file_nodes" WHERE id = $1;';
    const res = await this.pool.query<FileNode>(query, [id]);
    return res.rows[0] || null;
  }

  async update(
    id: string,
    updateData: Partial<FileNode>,
  ): Promise<FileNode | null> {
    const fields = Object.keys(updateData).filter(
      (key) => updateData[key as keyof FileNode] !== undefined,
    );
    if (fields.length === 0) {
      return this.findById(id);
    }

    const setClauses: string[] = [];
    const params: any[] = [id];

    fields.forEach((field) => {
      params.push(updateData[field as keyof FileNode]);
      setClauses.push(`"${field}" = $${params.length}`);
    });

    const query = `
      UPDATE "file_nodes"
      SET ${setClauses.join(', ')}
      WHERE id = $1
      RETURNING *;
    `;
    const res = await this.pool.query<FileNode>(query, params);
    return res.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM "file_nodes" WHERE id = $1;';
    const res = await this.pool.query(query, [id]);
    return (res.rowCount ?? 0) > 0;
  }

  async findByStudentId(studentId: string): Promise<FileNode[]> {
    const query = `
      SELECT * FROM "file_nodes"
      WHERE student_id = $1
      ORDER BY is_folder DESC, sort_order ASC, name ASC;
    `;
    const res = await this.pool.query<FileNode>(query, [studentId]);
    return res.rows;
  }
}
