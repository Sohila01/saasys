import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { SupabaseService } from '../../services/supabase.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, SupabaseService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
