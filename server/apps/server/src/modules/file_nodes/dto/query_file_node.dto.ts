import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class QueryFileNodeDto {
  @ApiPropertyOptional({ description: 'Filter by student ID' })
  @IsUUID()
  @IsOptional()
  student_id?: string;

  @ApiPropertyOptional({
    description:
      'Filter by parent node ID (use "null" or leave empty for root)',
  })
  @IsString()
  @IsOptional()
  parent_id?: string;

  @ApiPropertyOptional({ description: 'Search term for file/folder name' })
  @IsString()
  @IsOptional()
  search?: string;
}
