import { Module } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { AttachmentsController } from './attachments.controller';
import { SupabaseService } from '../../services/supabase.service';

@Module({
  controllers: [AttachmentsController],
  providers: [AttachmentsService, SupabaseService],
  exports: [AttachmentsService],
})
export class AttachmentsModule {}
