import { Module } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { WorkflowsController } from './workflows.controller';
import { SupabaseService } from '../../services/supabase.service';

@Module({
  controllers: [WorkflowsController],
  providers: [WorkflowsService, SupabaseService],
  exports: [WorkflowsService],
})
export class WorkflowsModule {}
