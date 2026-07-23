import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsInt,
  ValidateIf,
} from 'class-validator';

export class UpdateFileNodeDto {
  @ApiPropertyOptional({ example: 'Renamed Folder' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @ValidateIf((o: UpdateFileNodeDto) => o.parent_id !== null)
  @IsUUID()
  @IsOptional()
  parent_id?: string | null;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  sort_order?: number;
}
