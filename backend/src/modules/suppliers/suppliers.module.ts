import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { SupabaseService } from '../../services/supabase.service';

@Module({
  controllers: [SuppliersController],
  providers: [SuppliersService, SupabaseService],
  exports: [SuppliersService],
})
export class SuppliersModule {}
