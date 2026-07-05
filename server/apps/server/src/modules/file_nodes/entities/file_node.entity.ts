import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FileNode {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  student_id: string;

  @ApiProperty({ example: 'My Folder' })
  name: string;

  @ApiProperty({ example: true })
  is_folder: boolean;

  @ApiPropertyOptional({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  parent_id?: string;

  @ApiPropertyOptional({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  note_id?: string;

  @ApiProperty({ example: 0 })
  sort_order: number;

  @ApiProperty({ example: '2026-07-05T09:27:25Z' })
  created_at: Date;

  @ApiProperty({ example: '2026-07-05T09:27:25Z' })
  updated_at: Date;

  // Recursive tree relation
  @ApiPropertyOptional({ type: () => [FileNode] })
  children?: FileNode[];
}
