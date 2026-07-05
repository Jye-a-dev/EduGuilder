import { Module } from '@nestjs/common';
import { DocumentExportsController } from './document_exports.controller';
import { DocumentExportsService } from './document_exports.service';
import { DocumentExportsRepository } from './repositories/document_exports.repository';

@Module({
  controllers: [DocumentExportsController],
  providers: [DocumentExportsService, DocumentExportsRepository],
  exports: [DocumentExportsService, DocumentExportsRepository],
})
export class DocumentExportsModule {}
