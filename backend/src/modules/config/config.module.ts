import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';
import { SupabaseService } from '../../services/supabase.service';

@Module({
  controllers: [ConfigController],
  providers: [ConfigService, SupabaseService],
  exports: [ConfigService],
})
export class ConfigModule {}
