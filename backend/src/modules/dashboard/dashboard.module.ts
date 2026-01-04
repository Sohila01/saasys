import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { SupabaseService } from '../../services/supabase.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, SupabaseService],
  exports: [DashboardService],
})
export class DashboardModule {}
