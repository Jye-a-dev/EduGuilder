import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { NotesRepository } from './repositories/notes.repository';
import { CreateNoteDto } from './dto/create_note.dto';
import { UpdateNoteDto } from './dto/update_note.dto';
import { QueryNoteDto } from './dto/query_note.dto';
import { Note, NoteLink, NoteTable, NoteSlide } from './entities/note.entity';
import {
  CreateNoteTableDto,
  CreateNoteSlideDto,
} from './dto/note_sub_items.dto';

@Injectable()
export class NotesService {
  constructor(private readonly repository: NotesRepository) {}

  private async parseTagsAndLinks(
    noteId: string,
    studentId: string,
    content: string,
  ): Promise<void> {
    const plainText = content.replace(/<[^>]*>/g, ' ');
    // 1. Tag parsing & syncing
    const tagRegex = /(?:^|\s)#([a-zA-Z0-9_\u00C0-\u1EF9]+)/g;
    const tagNames: string[] = [];
    let match: RegExpExecArray | null = null;
    while ((match = tagRegex.exec(plainText)) !== null) {
      const tagName = match[1].toLowerCase().trim();
      if (tagName && !tagNames.includes(tagName)) {
        tagNames.push(tagName);
      }
    }

    await this.repository.detachTags(noteId);
    for (const tagName of tagNames) {
      const tag = await this.repository.getOrCreateTag(tagName);
      await this.repository.attachTag(noteId, tag.id);
    }

    // 2. Link parsing & syncing (wiki-links [[title]])
    const linkRegex = /\[\[(.*?)\]\]/g;
    const linkTitles: string[] = [];
    while ((match = linkRegex.exec(plainText)) !== null) {
      const title = match[1].trim();
      if (title && !linkTitles.includes(title)) {
        linkTitles.push(title);
      }
    }

    await this.repository.unlinkAllNotes(noteId);
    for (const title of linkTitles) {
      let targetNote = await this.repository.findNoteByTitle(studentId, title);
      if (!targetNote) {
        // Create draft note automatically if target note doesn't exist
        targetNote = await this.repository.create({
          student_id: studentId,
          title: title,
          content: `Draft note created automatically via wiki link.`,
        });
      }
      await this.repository.linkNotes(noteId, targetNote.id);
    }
  }

  async create(createDto: CreateNoteDto): Promise<Note> {
    const note = await this.repository.create({
      student_id: createDto.student_id,
      title: createDto.title,
      content: createDto.content,
    });

    // Gamification Eco-Points award +10 to student
    await this.repository.incrementStudentEcoPoints(createDto.student_id, 10);

    // Sync parsed tags & links
    await this.parseTagsAndLinks(
      note.id,
      createDto.student_id,
      createDto.content ?? '',
    );

    // Attach additional DTO tags if they exist
    if (createDto.tags && createDto.tags.length > 0) {
      for (const tagName of createDto.tags) {
        const tag = await this.repository.getOrCreateTag(tagName);
        await this.repository.attachTag(note.id, tag.id);
      }
    }

    return this.findOne(note.id);
  }

  async findAll(
    queryDto: QueryNoteDto,
  ): Promise<{ data: Note[]; total: number }> {
    const result = await this.repository.findAll(queryDto);
    for (const note of result.data) {
      note.tags = await this.repository.getNoteTags(note.id);
    }
    return result;
  }

  async count(queryDto: Omit<QueryNoteDto, 'page' | 'limit'>): Promise<number> {
    return this.repository.count(queryDto);
  }

  async findOne(id: string): Promise<Note> {
    const note = await this.repository.findById(id);
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    note.tags = await this.repository.getNoteTags(id);
    note.tables = await this.repository.getNoteTables(id);
    note.slides = await this.repository.getNoteSlides(id);
    return note;
  }

  async update(id: string, updateDto: UpdateNoteDto): Promise<Note> {
    const note = await this.findOne(id);

    const updateData: Partial<Note> = {};
    if (updateDto.title !== undefined) updateData.title = updateDto.title;
    if (updateDto.content !== undefined) updateData.content = updateDto.content;

    await this.repository.update(id, updateData);

    if (updateDto.content !== undefined) {
      await this.parseTagsAndLinks(id, note.student_id, updateDto.content);
    }

    if (updateDto.tags !== undefined) {
      await this.repository.detachTags(id);
      for (const tagName of updateDto.tags) {
        const tag = await this.repository.getOrCreateTag(tagName);
        await this.repository.attachTag(id, tag.id);
      }
    }

    return this.findOne(id);
  }

  async remove(id: string, hardDelete = false): Promise<void> {
    await this.findOne(id);
    const success = hardDelete
      ? await this.repository.hardDelete(id)
      : await this.repository.softDelete(id);

    if (!success) {
      throw new NotFoundException(`Note with ID ${id} could not be deleted`);
    }
  }

  async restore(id: string): Promise<void> {
    const success = await this.repository.restore(id);
    if (!success) {
      throw new ConflictException(
        `Note with ID ${id} is not deleted or could not be restored`,
      );
    }
  }

  // --- Note Links ---
  async linkNotes(sourceId: string, targetId: string): Promise<NoteLink> {
    if (sourceId === targetId) {
      throw new ConflictException('Cannot link a note to itself');
    }
    await this.findOne(sourceId);
    await this.findOne(targetId);
    return this.repository.linkNotes(sourceId, targetId);
  }

  async unlinkNotes(sourceId: string, targetId: string): Promise<void> {
    await this.findOne(sourceId);
    await this.findOne(targetId);
    const success = await this.repository.unlinkNotes(sourceId, targetId);
    if (!success) {
      throw new NotFoundException(
        `Link between note ${sourceId} and ${targetId} not found`,
      );
    }
  }

  async getLinkedNotes(id: string): Promise<Note[]> {
    await this.findOne(id);
    return this.repository.getLinkedNotes(id);
  }

  // --- Note Tables ---
  async addTable(
    noteId: string,
    tableDto: CreateNoteTableDto,
  ): Promise<NoteTable> {
    await this.findOne(noteId);
    return this.repository.createTable(
      noteId,
      tableDto.table_index,
      tableDto.headers,
      tableDto.rows,
    );
  }

  async clearTables(noteId: string): Promise<void> {
    await this.findOne(noteId);
    await this.repository.deleteTables(noteId);
  }

  async deleteTable(noteId: string, tableId: string): Promise<void> {
    await this.findOne(noteId);
    await this.repository.deleteTable(noteId, tableId);
  }

  // --- Note Slides ---
  async addSlide(
    noteId: string,
    slideDto: CreateNoteSlideDto,
  ): Promise<NoteSlide> {
    await this.findOne(noteId);
    return this.repository.createSlide(noteId, slideDto);
  }

  async clearSlides(noteId: string): Promise<void> {
    await this.findOne(noteId);
    await this.repository.deleteSlides(noteId);
  }

  async deleteSlide(noteId: string, slideId: string): Promise<void> {
    await this.findOne(noteId);
    await this.repository.deleteSlide(noteId, slideId);
  }
}
