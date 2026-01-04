import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../services/supabase.service';

@Injectable()
export class ConfigService {
  constructor(private supabaseService: SupabaseService) {}

  async getModules(tenantId: string, token: string) {
    const { data } = await this.supabaseService
      .getClientWithToken(token)
      .from('sub_modules')
      .select('*, sub_module_fields(*)')
      .eq('tenant_id', tenantId);

    return data || [];
  }

  async getModuleFields(moduleId: string, token: string) {
    const { data } = await this.supabaseService
      .getClientWithToken(token)
      .from('sub_module_fields')
      .select('*')
      .eq('module_id', moduleId);

    return data || [];
  }
}
