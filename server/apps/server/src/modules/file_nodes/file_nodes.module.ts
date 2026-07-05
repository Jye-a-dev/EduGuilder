import { Module } from '@nestjs/common';
import { FileNodesController } from './file_nodes.controller';
import { FileNodesService } from './file_nodes.service';
import { FileNodesRepository } from './repositories/file_nodes.repository';

@Module({
  controllers: [FileNodesController],
  providers: [FileNodesService, FileNodesRepository],
  exports: [FileNodesService, FileNodesRepository],
})
export class FileNodesModule {}
