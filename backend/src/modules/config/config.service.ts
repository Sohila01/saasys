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

  async createSubModule(tenantId: string, token: string, payload: any) {
    // Normalize code to lowercase and replace spaces with underscores
    const normalizedCode = payload.code
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');

    // Prepare the insert payload with all required fields
    const insertPayload = {
      tenant_id: tenantId,
      name: payload.name,
      code: normalizedCode,
      main_module_id: payload.main_module_id || null,
      description: payload.description || null,
      icon: payload.icon || null,
      display_name_singular: payload.display_name_singular || payload.name,
      display_name_plural: payload.display_name_plural || (payload.name + 's'),
      settings: payload.settings || {},
      list_view_config: payload.list_view_config || { columns: [], filters: [] },
      form_view_config: payload.form_view_config || {},
      sort_order: 0
    };

    const { data, error } = await this.supabaseService
      .getClientWithToken(token)
      .from('sub_modules')
      .insert([insertPayload])
      .select()
      .single();

    if (error) {
      if (error.message?.includes('unique') || error.message?.includes('UNIQUE')) {
        throw new Error(`A module with code "${normalizedCode}" already exists in this tenant.`);
      }
      throw new Error(`Failed to create sub-module: ${error.message}`);
    }

    return data;
  }
}
