
import { supabase } from './supabase';
import { 
  MainModule, SubModule, SubModuleField, SubModuleRecord, 
  Dashboard, Widget, Workflow, Comment, User 
} from '../types';

// Tenant ID is normally resolved from the current authenticated user's profile
const getTenantId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return '00000000-0000-0000-0000-000000000000'; // Default or anonymous
  const { data } = await supabase.from('users').select('tenant_id').eq('id', user.id).single();
  return data?.tenant_id || '00000000-0000-0000-0000-000000000000';
};

export const api = {
  // --- Modules & Schema ---
  getModules: async (): Promise<MainModule[]> => {
    const { data, error } = await supabase.from('main_modules').select('*').order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  getSubModules: async (): Promise<SubModule[]> => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase.from('sub_modules').select('*').eq('tenant_id', tenantId).order('name', { ascending: true });
    if (error) throw error;
    return data || [];
  },
  
  createSubModule: async (payload: Omit<SubModule, 'id'>) => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase.from('sub_modules').insert([{ ...payload, tenant_id: tenantId }]).select().single();
    if (error) throw error;
    return data;
  },

  getFields: async (subModuleId: string): Promise<SubModuleField[]> => {
    const { data, error } = await supabase.from('sub_module_fields').select('*').eq('sub_module_id', subModuleId).order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  saveSchema: async (subModuleId: string, fields: SubModuleField[]) => {
    const tenantId = await getTenantId();
    // Use a transaction-like approach (Delete then Insert)
    const { error: deleteError } = await supabase.from('sub_module_fields').delete().eq('sub_module_id', subModuleId);
    if (deleteError) throw deleteError;

    const formattedFields = fields.map((f, index) => ({
      tenant_id: tenantId,
      sub_module_id: subModuleId,
      name: f.name,
      db_name: f.db_name,
      field_type: f.field_type,
      options: f.options || [],
      is_required: f.is_required,
      is_visible_in_list: f.is_visible_in_list,
      sort_order: index
    }));

    const { data, error } = await supabase.from('sub_module_fields').insert(formattedFields).select();
    if (error) throw error;
    return data;
  },

  // --- Dynamic Records ---
  getRecords: async (moduleCode: string) => {
    const tenantId = await getTenantId();
    const { data: sub } = await supabase.from('sub_modules').select('id').eq('code', moduleCode).eq('tenant_id', tenantId).single();
    if (!sub) throw new Error('Module not found.');

    const [fieldsRes, recordsRes] = await Promise.all([
      supabase.from('sub_module_fields').select('*').eq('sub_module_id', sub.id).order('sort_order', { ascending: true }),
      supabase.from('sub_module_records').select('*').eq('sub_module_id', sub.id).eq('tenant_id', tenantId).order('created_at', { ascending: false })
    ]);

    if (fieldsRes.error) throw fieldsRes.error;
    if (recordsRes.error) throw recordsRes.error;

    return { records: recordsRes.data as SubModuleRecord[], fields: fieldsRes.data as SubModuleField[] };
  },

  createRecord: async (moduleCode: string, recordData: any) => {
    const tenantId = await getTenantId();
    const { data: sub } = await supabase.from('sub_modules').select('id').eq('code', moduleCode).eq('tenant_id', tenantId).single();
    const { data, error } = await supabase.from('sub_module_records').insert([{ sub_module_id: sub?.id, tenant_id: tenantId, data: recordData }]).select().single();
    if (error) throw error;
    return data;
  },

  updateRecord: async (id: string, recordData: any) => {
    const tenantId = await getTenantId();
    const { error } = await supabase.from('sub_module_records').update({ data: recordData, updated_at: new Date().toISOString() }).eq('id', id).eq('tenant_id', tenantId);
    if (error) throw error;
  },

  deleteRecord: async (id: string) => {
    const tenantId = await getTenantId();
    const { error } = await supabase.from('sub_module_records').delete().eq('id', id).eq('tenant_id', tenantId);
    if (error) throw error;
  },

  // --- Workflows ---
  getWorkflows: async (): Promise<Workflow[]> => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase.from('workflows').select('*').eq('tenant_id', tenantId);
    if (error) throw error;
    return data || [];
  },

  saveWorkflow: async (workflow: Partial<Workflow>) => {
    const tenantId = await getTenantId();
    if (workflow.id) {
      const { data, error } = await supabase.from('workflows').update(workflow).eq('id', workflow.id).select().single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase.from('workflows').insert([{ ...workflow, tenant_id: tenantId }]).select().single();
      if (error) throw error;
      return data;
    }
  },

  // --- Dashboards ---
  getDashboards: async (): Promise<Dashboard[]> => {
    const tenantId = await getTenantId();
    const { data, error } = await supabase.from('dashboards').select('*, widgets:dashboard_widgets(*)').eq('tenant_id', tenantId);
    if (error) throw error;
    
    // If no dashboard exists, create a default one
    if (!data || data.length === 0) {
      const { data: newDash, error: createError } = await supabase.from('dashboards').insert([{ tenant_id: tenantId, name: 'Executive Intelligence', is_default: true }]).select().single();
      if (createError) throw createError;
      return [{ ...newDash, widgets: [] }];
    }
    return data;
  },

  saveDashboard: async (dashboard: Dashboard) => {
    const { error } = await supabase.from('dashboards').update({ name: dashboard.name }).eq('id', dashboard.id);
    if (error) throw error;
    
    // Synchronize widgets
    await supabase.from('dashboard_widgets').delete().eq('dashboard_id', dashboard.id);
    const formattedWidgets = dashboard.widgets.map((w, idx) => ({
      dashboard_id: dashboard.id,
      title: w.title,
      widget_type: w.widget_type,
      query_config: w.query_config,
      layout_config: w.layout_config,
      sort_order: idx
    }));
    await supabase.from('dashboard_widgets').insert(formattedWidgets);
  }
};
