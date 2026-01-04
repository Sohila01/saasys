import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { SupabaseService } from '../../services/supabase.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, SupabaseService],
  exports: [CommentsService],
})
export class CommentsModule {}
