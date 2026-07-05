import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentExportsRepository } from './repositories/document_exports.repository';
import { CreateDocumentExportDto } from './dto/create_document_export.dto';
import { UpdateDocumentExportDto } from './dto/update_document_export.dto';
import { QueryDocumentExportDto } from './dto/query_document_export.dto';
import { DocumentExport } from './entities/document_export.entity';

@Injectable()
export class DocumentExportsService {
  constructor(private readonly repository: DocumentExportsRepository) {}

  async create(dto: CreateDocumentExportDto): Promise<DocumentExport> {
    return this.repository.create(dto);
  }

  async findAll(
    queryDto: QueryDocumentExportDto,
  ): Promise<{ data: DocumentExport[]; total: number }> {
    return this.repository.findAll(queryDto);
  }

  async findOne(id: string): Promise<DocumentExport> {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new NotFoundException(
        `Document export request with ID ${id} not found`,
      );
    }
    return record;
  }

  async update(
    id: string,
    dto: UpdateDocumentExportDto,
  ): Promise<DocumentExport> {
    await this.findOne(id);
    const updated = await this.repository.update(id, dto);
    return updated!;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repository.delete(id);
  }
}
