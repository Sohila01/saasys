import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../services/supabase.service';

@Injectable()
export class DashboardService {
  constructor(private supabaseService: SupabaseService) {}

  async getDashboards(tenantId: string, token: string) {
    const { data } = await this.supabaseService
      .getClientWithToken(token)
      .from('dashboards')
      .select('*, dashboard_widgets(*)')
      .eq('tenant_id', tenantId);

    return data || [];
  }

  async getDashboard(dashboardId: string, token: string) {
    const { data } = await this.supabaseService
      .getClientWithToken(token)
      .from('dashboards')
      .select('*, dashboard_widgets(*)')
      .eq('id', dashboardId)
      .single();

    return data;
  }
}
