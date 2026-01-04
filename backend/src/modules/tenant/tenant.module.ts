import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { SupabaseService } from '../../services/supabase.service';

@Module({
  controllers: [TenantController],
  providers: [TenantService, SupabaseService],
  exports: [TenantService],
})
export class TenantModule {}
