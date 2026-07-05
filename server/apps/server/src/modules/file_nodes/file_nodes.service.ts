import { Injectable, NotFoundException } from '@nestjs/common';
import { FileNodesRepository } from './repositories/file_nodes.repository';
import { CreateFileNodeDto } from './dto/create_file_node.dto';
import { UpdateFileNodeDto } from './dto/update_file_node.dto';
import { QueryFileNodeDto } from './dto/query_file_node.dto';
import { FileNode } from './entities/file_node.entity';

@Injectable()
export class FileNodesService {
  constructor(private readonly repository: FileNodesRepository) {}

  async create(dto: CreateFileNodeDto): Promise<FileNode> {
    if (dto.parent_id) {
      const parent = await this.repository.findById(dto.parent_id);
      if (!parent) {
        throw new NotFoundException(
          `Parent folder with ID ${dto.parent_id} not found`,
        );
      }
      if (!parent.is_folder) {
        throw new Error('Parent node must be a folder');
      }
    }
    return this.repository.create(dto);
  }

  async findAll(queryDto: QueryFileNodeDto): Promise<FileNode[]> {
    return this.repository.findAll(queryDto);
  }

  async findOne(id: string): Promise<FileNode> {
    const node = await this.repository.findById(id);
    if (!node) {
      throw new NotFoundException(`File node with ID ${id} not found`);
    }
    return node;
  }

  async update(id: string, dto: UpdateFileNodeDto): Promise<FileNode> {
    await this.findOne(id);
    if (dto.parent_id) {
      const parent = await this.repository.findById(dto.parent_id);
      if (!parent) {
        throw new NotFoundException(
          `Parent folder with ID ${dto.parent_id} not found`,
        );
      }
      if (!parent.is_folder) {
        throw new Error('Parent node must be a folder');
      }
    }
    const updated = await this.repository.update(id, dto);
    return updated!;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repository.delete(id);
  }

  async getTree(studentId: string): Promise<FileNode[]> {
    const nodes = await this.repository.findByStudentId(studentId);
    return this.buildTree(nodes, null);
  }

  private buildTree(nodes: FileNode[], parentId: string | null): FileNode[] {
    const result: FileNode[] = [];
    for (const node of nodes) {
      if (node.parent_id === parentId) {
        const children = this.buildTree(nodes, node.id);
        result.push({
          ...node,
          children: children.length > 0 ? children : undefined,
        });
      }
    }
    return result;
  }
}
