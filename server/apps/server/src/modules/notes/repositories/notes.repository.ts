import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../../../database/pg.provider';
import {
  Note,
  NoteLink,
  Tag,
  NoteTable,
  NoteSlide,
} from '../entities/note.entity';
import { QueryNoteDto } from '../dto/query_note.dto';

@Injectable()
export class NotesRepository {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  async create(noteData: Partial<Note>): Promise<Note> {
    const query = `
      INSERT INTO "notes" (
        student_id, title, content
      ) VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [noteData.student_id, noteData.title, noteData.content];
    const res = await this.pool.query<Note>(query, values);
    return res.rows[0];
  }

  async findAll(
    queryDto: QueryNoteDto,
  ): Promise<{ data: Note[]; total: number }> {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const search = queryDto.search;
    const student_id = queryDto.student_id;
    const includeDeleted = queryDto.includeDeleted || false;
    const sortBy = queryDto.sortBy || 'created_at';
    const sortOrder = queryDto.sortOrder || 'DESC';

    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (!includeDeleted) {
      conditions.push('deleted_at IS NULL');
    }

    if (student_id) {
      params.push(student_id);
      conditions.push(`student_id = $${params.length}`);
    }

    if (search) {
      params.push(search);
      // Use Postgres FTS on tsv_content
      conditions.push(
        `tsv_content @@ plainto_tsquery('simple', $${params.length})`,
      );
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const allowedSort = ['created_at', 'updated_at', 'title'];
    const actualSortBy = allowedSort.includes(sortBy) ? sortBy : 'created_at';
    const actualSortOrder = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    // Count
    const countQuery = `SELECT COUNT(*)::int FROM "notes" ${whereClause};`;
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
      SELECT * FROM "notes"
      ${whereClause}
      ORDER BY "${actualSortBy}" ${actualSortOrder}
      LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder};
    `;
    const dataRes = await this.pool.query<Note>(dataQuery, dataParams);

    return {
      data: dataRes.rows,
      total,
    };
  }

  async count(queryDto: Omit<QueryNoteDto, 'page' | 'limit'>): Promise<number> {
    const { search, student_id, includeDeleted } = queryDto;
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (!includeDeleted) {
      conditions.push('deleted_at IS NULL');
    }

    if (student_id) {
      params.push(student_id);
      conditions.push(`student_id = $${params.length}`);
    }

    if (search) {
      params.push(search);
      conditions.push(
        `tsv_content @@ plainto_tsquery('simple', $${params.length})`,
      );
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const countQuery = `SELECT COUNT(*)::int FROM "notes" ${whereClause};`;
    const countRes = await this.pool.query<{ count: number }>(
      countQuery,
      params,
    );
    return countRes.rows[0].count;
  }

  async findById(id: string): Promise<Note | null> {
    const query = 'SELECT * FROM "notes" WHERE id = $1;';
    const res = await this.pool.query<Note>(query, [id]);
    return res.rows[0] || null;
  }

  async update(id: string, updateData: Partial<Note>): Promise<Note | null> {
    const fields = Object.keys(updateData).filter(
      (key) => updateData[key as keyof Note] !== undefined,
    );
    if (fields.length === 0) {
      return this.findById(id);
    }

    const setClauses: string[] = [];
    const params: any[] = [id];

    fields.forEach((field) => {
      params.push(updateData[field as keyof Note]);
      setClauses.push(`"${field}" = $${params.length}`);
    });

    const query = `
      UPDATE "notes"
      SET ${setClauses.join(', ')}
      WHERE id = $1
      RETURNING *;
    `;
    const res = await this.pool.query<Note>(query, params);
    return res.rows[0] || null;
  }

  async softDelete(id: string): Promise<boolean> {
    const query =
      'UPDATE "notes" SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL;';
    const res = await this.pool.query(query, [id]);
    return (res.rowCount ?? 0) > 0;
  }

  async restore(id: string): Promise<boolean> {
    const query =
      'UPDATE "notes" SET deleted_at = NULL WHERE id = $1 AND deleted_at IS NOT NULL;';
    const res = await this.pool.query(query, [id]);
    return (res.rowCount ?? 0) > 0;
  }

  async hardDelete(id: string): Promise<boolean> {
    const query = 'DELETE FROM "notes" WHERE id = $1;';
    const res = await this.pool.query(query, [id]);
    return (res.rowCount ?? 0) > 0;
  }

  // --- NOTE LINKS ---
  async linkNotes(sourceId: string, targetId: string): Promise<NoteLink> {
    const query = `
      INSERT INTO "note_links" (source_note_id, target_note_id)
      VALUES ($1, $2)
      ON CONFLICT ("source_note_id", "target_note_id") DO UPDATE SET created_at = NOW()
      RETURNING *;
    `;
    const res = await this.pool.query<NoteLink>(query, [sourceId, targetId]);
    return res.rows[0];
  }

  async unlinkNotes(sourceId: string, targetId: string): Promise<boolean> {
    const query =
      'DELETE FROM "note_links" WHERE source_note_id = $1 AND target_note_id = $2;';
    const res = await this.pool.query(query, [sourceId, targetId]);
    return (res.rowCount ?? 0) > 0;
  }

  async getLinkedNotes(noteId: string): Promise<Note[]> {
    const query = `
      SELECT n.* FROM "notes" n
      INNER JOIN "note_links" nl ON n.id = nl.target_note_id
      WHERE nl.source_note_id = $1 AND n.deleted_at IS NULL;
    `;
    const res = await this.pool.query<Note>(query, [noteId]);
    return res.rows;
  }

  // --- TAGS ---
  async getOrCreateTag(name: string): Promise<Tag> {
    const query = `
      INSERT INTO "tags" (name)
      VALUES ($1)
      ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
      RETURNING *;
    `;
    const res = await this.pool.query<Tag>(query, [name.toLowerCase().trim()]);
    return res.rows[0];
  }

  async attachTag(noteId: string, tagId: string): Promise<void> {
    const query = `
      INSERT INTO "note_tags" (note_id, tag_id)
      VALUES ($1, $2)
      ON CONFLICT (note_id, tag_id) DO NOTHING;
    `;
    await this.pool.query(query, [noteId, tagId]);
  }

  async detachTags(noteId: string): Promise<void> {
    const query = 'DELETE FROM "note_tags" WHERE note_id = $1;';
    await this.pool.query(query, [noteId]);
  }

  async getNoteTags(noteId: string): Promise<Tag[]> {
    const query = `
      SELECT t.* FROM "tags" t
      INNER JOIN "note_tags" nt ON t.id = nt.tag_id
      WHERE nt.note_id = $1;
    `;
    const res = await this.pool.query<Tag>(query, [noteId]);
    return res.rows;
  }

  // --- TABLES ---
  async createTable(
    noteId: string,
    index: number,
    headers: any,
    rows: any,
  ): Promise<NoteTable> {
    const query = `
      INSERT INTO "note_tables" (note_id, table_index, headers, rows)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const res = await this.pool.query<NoteTable>(query, [
      noteId,
      index,
      JSON.stringify(headers),
      JSON.stringify(rows),
    ]);
    return res.rows[0];
  }

  async deleteTables(noteId: string): Promise<void> {
    const query = 'DELETE FROM "note_tables" WHERE note_id = $1;';
    await this.pool.query(query, [noteId]);
  }

  async deleteTable(noteId: string, tableId: string): Promise<void> {
    const query = 'DELETE FROM "note_tables" WHERE note_id = $1 AND id = $2;';
    await this.pool.query(query, [noteId, tableId]);
  }

  async getNoteTables(noteId: string): Promise<NoteTable[]> {
    const query =
      'SELECT * FROM "note_tables" WHERE note_id = $1 ORDER BY table_index ASC;';
    const res = await this.pool.query<NoteTable>(query, [noteId]);
    return res.rows;
  }

  // --- SLIDES ---
  async createSlide(
    noteId: string,
    slide: Partial<NoteSlide>,
  ): Promise<NoteSlide> {
    const query = `
      INSERT INTO "note_slides" (note_id, slide_index, slide_type, title, bullet_points, background_color)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const res = await this.pool.query<NoteSlide>(query, [
      noteId,
      slide.slide_index,
      slide.slide_type || 'content',
      slide.title || null,
      JSON.stringify(slide.bullet_points || []),
      slide.background_color || '#ffffff',
    ]);
    return res.rows[0];
  }

  async deleteSlides(noteId: string): Promise<void> {
    const query = 'DELETE FROM "note_slides" WHERE note_id = $1;';
    await this.pool.query(query, [noteId]);
  }

  async deleteSlide(noteId: string, slideId: string): Promise<void> {
    const query = 'DELETE FROM "note_slides" WHERE note_id = $1 AND id = $2;';
    await this.pool.query(query, [noteId, slideId]);
  }

  async getNoteSlides(noteId: string): Promise<NoteSlide[]> {
    const query =
      'SELECT * FROM "note_slides" WHERE note_id = $1 ORDER BY slide_index ASC;';
    const res = await this.pool.query<NoteSlide>(query, [noteId]);
    return res.rows;
  }

  // --- NEW TREE / AUTO-LINK METHODS ---
  async unlinkAllNotes(sourceId: string): Promise<void> {
    const query = 'DELETE FROM "note_links" WHERE source_note_id = $1;';
    await this.pool.query(query, [sourceId]);
  }

  async findNoteByTitle(
    studentId: string,
    title: string,
  ): Promise<Note | null> {
    const query = `
      SELECT * FROM "notes" 
      WHERE student_id = $1 AND LOWER(title) = LOWER($2) AND deleted_at IS NULL
      LIMIT 1;
    `;
    const res = await this.pool.query<Note>(query, [studentId, title]);
    return res.rows[0] || null;
  }

  async incrementStudentEcoPoints(
    studentId: string,
    points: number,
  ): Promise<void> {
    const query = `
      UPDATE "users"
      SET eco_points = eco_points + $1
      WHERE id = $2 AND role = 'student';
    `;
    await this.pool.query(query, [points, studentId]);
  }
}
