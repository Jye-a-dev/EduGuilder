import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsInt } from 'class-validator';

export class UpdateDocumentExportDto {
  @ApiPropertyOptional({
    example: 'completed',
    enum: ['pending', 'processing', 'completed', 'failed'],
  })
  @IsEnum(['pending', 'processing', 'completed', 'failed'])
  @IsOptional()
  status?: 'pending' | 'processing' | 'completed' | 'failed';

  @ApiPropertyOptional({ example: 2048576 })
  @IsInt()
  @IsOptional()
  file_size_bytes?: number;
}
