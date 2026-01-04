
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  TENANT_ADMIN = 'tenant_admin',
  USER = 'user',
  SUPPLIER = 'supplier'
}

export type FieldType = 'text' | 'number' | 'date' | 'select' | 'boolean' | 'attachment';

export interface User {
  id: string;
  tenant_id: string;
  full_name: string;
  email: string;
  role: UserRole;
}

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  settings: any;
}

export interface MainModule {
  id: string;
  name: string;
  icon: string;
  sort_order: number;
}

export interface SubModule {
  id: string;
  main_module_id: string;
  name: string;
  code: string;
  settings: any;
}

export interface SubModuleField {
  id: string;
  sub_module_id: string;
  name: string;
  db_name: string;
  field_type: FieldType;
  options?: any[];
  is_required: boolean;
  is_visible_in_list: boolean;
  sort_order: number;
}

export interface SubModuleRecord {
  id: string;
  sub_module_id: string;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Widget {
  id: string;
  title: string;
  widget_type: 'bar' | 'line' | 'pie' | 'stat' | 'table';
  query_config: {
    subModuleId: string;
    metric: string;
    aggregation: 'count' | 'sum' | 'avg';
  };
  layout_config: {
    w: number;
    h: number;
  };
}

export interface Dashboard {
  id: string;
  name: string;
  widgets: Widget[];
}

export interface Workflow {
  id: string;
  name: string;
  trigger_module_id: string;
  trigger_event: 'on_create' | 'on_update' | 'on_delete';
  action_type: 'email' | 'notification' | 'webhook';
  action_config: any;
  is_active: boolean;
}

export interface Comment {
  id: string;
  record_id: string;
  user_id: string;
  user_name?: string;
  content: string;
  created_at: string;
}
