import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../services/supabase.service';

@Injectable()
export class WorkflowsService {
  constructor(private supabaseService: SupabaseService) {}

  async getWorkflows(tenantId: string, token: string) {
    const { data } = await this.supabaseService
      .getClientWithToken(token)
      .from('workflows')
      .select('*')
      .eq('tenant_id', tenantId);

    return data || [];
  }

  async createWorkflow(tenantId: string, workflowData: any, token: string) {
    const { data } = await this.supabaseService
      .getClientWithToken(token)
      .from('workflows')
      .insert([{ ...workflowData, tenant_id: tenantId }])
      .select()
      .single();

    return data;
  }

  async updateWorkflow(workflowId: string, workflowData: any, token: string) {
    const { data } = await this.supabaseService
      .getClientWithToken(token)
      .from('workflows')
      .update(workflowData)
      .eq('id', workflowId)
      .select()
      .single();

    return data;
  }

  async deleteWorkflow(workflowId: string, token: string) {
    await this.supabaseService
      .getClientWithToken(token)
      .from('workflows')
      .delete()
      .eq('id', workflowId);

    return { message: 'Workflow deleted' };
  }
}
