import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { SupabaseService } from '../../services/supabase.service';

@Module({
  controllers: [DataController],
  providers: [DataService, SupabaseService],
  exports: [DataService],
})
export class DataModule {}
