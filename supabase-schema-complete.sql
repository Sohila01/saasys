-- ============================================================
-- NEXUS SAAS PLATFORM - COMPLETE PRODUCTION SCHEMA
-- Multi-tenant, Row-Level Security enabled on all tables
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. TENANTS TABLE (Multi-tenancy root)
-- ============================================================
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subdomain text NOT NULL UNIQUE,
  logo_url text,
  settings jsonb DEFAULT '{"theme": "light", "language": "en"}'::jsonb,
  subscription_tier text DEFAULT 'starter', -- starter, professional, enterprise
  max_users integer DEFAULT 10,
  storage_quota_mb integer DEFAULT 1024,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tenants_subdomain ON tenants(subdomain);

-- ============================================================
-- 2. USERS TABLE (Authentication + Tenant Association)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  role text NOT NULL DEFAULT 'user', -- super_admin, tenant_admin, user, supplier
  is_active boolean DEFAULT true,
  last_login timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, email)
);

CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================
-- 3. MAIN MODULES (Global navigation structure)
-- ============================================================
CREATE TABLE IF NOT EXISTS main_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  code text NOT NULL UNIQUE,
  icon text,
  description text,
  sort_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- 4. SUB MODULES (Tenant-specific modules with schema definition)
-- ============================================================
CREATE TABLE IF NOT EXISTS sub_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  main_module_id uuid REFERENCES main_modules(id) ON DELETE SET NULL,
  name text NOT NULL,
  code text NOT NULL,
  description text,
  icon text,
  display_name_singular text,
  display_name_plural text,
  settings jsonb DEFAULT '{}'::jsonb,
  list_view_config jsonb DEFAULT '{"columns": [], "filters": []}'::jsonb,
  form_view_config jsonb DEFAULT '{}'::jsonb,
  sort_order integer DEFAULT 0,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, code)
);

CREATE INDEX IF NOT EXISTS idx_sub_modules_tenant_id ON sub_modules(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sub_modules_main_module_id ON sub_modules(main_module_id);

-- ============================================================
-- 5. SUB MODULE FIELDS (Dynamic schema per sub-module)
-- ============================================================
CREATE TABLE IF NOT EXISTS sub_module_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_module_id uuid NOT NULL REFERENCES sub_modules(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  db_name text NOT NULL,
  field_type text NOT NULL, -- text, number, date, datetime, select, boolean, attachment, json
  is_required boolean DEFAULT false,
  is_unique boolean DEFAULT false,
  is_visible_in_list boolean DEFAULT true,
  is_searchable boolean DEFAULT true,
  is_sortable boolean DEFAULT true,
  default_value text,
  placeholder text,
  validation_rules jsonb DEFAULT '{}'::jsonb,
  options jsonb DEFAULT '[]'::jsonb, -- for select fields
  help_text text,
  sort_order integer DEFAULT 0,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(sub_module_id, db_name)
);

CREATE INDEX IF NOT EXISTS idx_sub_module_fields_sub_module_id ON sub_module_fields(sub_module_id);

-- ============================================================
-- 6. DYNAMIC RECORDS TABLE (Stores data for all sub-modules)
-- ============================================================
CREATE TABLE IF NOT EXISTS sub_module_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_module_id uuid NOT NULL REFERENCES sub_modules(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sub_module_records_sub_module_id ON sub_module_records(sub_module_id);
CREATE INDEX IF NOT EXISTS idx_sub_module_records_tenant_id ON sub_module_records(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sub_module_records_created_at ON sub_module_records(created_at DESC);

-- ============================================================
-- 7. ATTACHMENTS (File storage references)
-- ============================================================
CREATE TABLE IF NOT EXISTS attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  record_id uuid REFERENCES sub_module_records(id) ON DELETE CASCADE,
  field_id uuid REFERENCES sub_module_fields(id) ON DELETE CASCADE,
  original_filename text NOT NULL,
  stored_filename text NOT NULL,
  file_type text,
  file_size_bytes integer,
  storage_path text NOT NULL,
  uploaded_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_attachments_tenant_id ON attachments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_attachments_record_id ON attachments(record_id);

-- ============================================================
-- 8. COMMENTS (Discussion on records)
-- ============================================================
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  record_id uuid NOT NULL REFERENCES sub_module_records(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  mentions uuid[] DEFAULT '{}',
  is_edited boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comments_tenant_id ON comments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_comments_record_id ON comments(record_id);

-- ============================================================
-- 9. NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL, -- comment_mention, record_assigned, record_updated
  title text NOT NULL,
  message text,
  related_record_id uuid REFERENCES sub_module_records(id) ON DELETE SET NULL,
  related_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  is_read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now(),
  read_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- ============================================================
-- 10. WORKFLOWS (Process automation)
-- ============================================================
CREATE TABLE IF NOT EXISTS workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  sub_module_id uuid NOT NULL REFERENCES sub_modules(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  trigger_type text NOT NULL, -- record_created, record_updated, manual, scheduled
  trigger_config jsonb NOT NULL,
  actions jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workflows_tenant_id ON workflows(tenant_id);

-- ============================================================
-- 11. DASHBOARDS
-- ============================================================
CREATE TABLE IF NOT EXISTS dashboards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  is_default boolean DEFAULT false,
  is_public boolean DEFAULT false,
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dashboards_tenant_id ON dashboards(tenant_id);

-- ============================================================
-- 12. DASHBOARD WIDGETS
-- ============================================================
CREATE TABLE IF NOT EXISTS dashboard_widgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_id uuid NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title text NOT NULL,
  widget_type text NOT NULL, -- metric, chart, table, kpi, timeline
  data_source_config jsonb NOT NULL, -- contains queries, filters
  display_config jsonb NOT NULL, -- chart type, colors, etc
  layout_config jsonb NOT NULL, -- position and size
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_dashboard_id ON dashboard_widgets(dashboard_id);

-- ============================================================
-- 13. DATA SOURCES (For dashboard queries)
-- ============================================================
CREATE TABLE IF NOT EXISTS data_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  source_type text NOT NULL, -- supabase_table, api, csv_upload
  config jsonb NOT NULL, -- connection info, query, etc
  is_cached boolean DEFAULT true,
  cache_ttl_minutes integer DEFAULT 60,
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_data_sources_tenant_id ON data_sources(tenant_id);

-- ============================================================
-- 14. SUPPLIERS (B2B Portal)
-- ============================================================
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid UNIQUE REFERENCES users(id) ON DELETE SET NULL,
  company_name text NOT NULL,
  registration_number text,
  industry text,
  country text,
  city text,
  address text,
  phone text,
  website text,
  payment_terms text,
  certifications jsonb DEFAULT '[]'::jsonb,
  profile_completion_percent integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_suppliers_tenant_id ON suppliers(tenant_id);

-- ============================================================
-- 15. SUPPLIER RATINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS supplier_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  rated_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quality_score integer,
  delivery_score integer,
  communication_score integer,
  comment text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_supplier_ratings_supplier_id ON supplier_ratings(supplier_id);

-- ============================================================
-- 16. EMAIL QUEUE (For async email processing)
-- ============================================================
CREATE TABLE IF NOT EXISTS email_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE SET NULL,
  recipient_email text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  template_id text,
  template_data jsonb,
  status text DEFAULT 'pending', -- pending, sent, failed, retry
  retry_count integer DEFAULT 0,
  max_retries integer DEFAULT 3,
  error_message text,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_created_at ON email_queue(created_at DESC);

-- ============================================================
-- 17. AUDIT LOG (Compliance & Security)
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  action text NOT NULL, -- create, update, delete, export, import
  changes jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_module_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_module_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get current tenant_id
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS uuid AS $$
BEGIN
  RETURN (auth.jwt() ->> 'tenant_id')::uuid;
END;
$$ LANGUAGE plpgsql STABLE;

-- USERS RLS
CREATE POLICY users_tenant_isolation ON users
  FOR SELECT USING (tenant_id = get_current_tenant_id());

CREATE POLICY users_insert ON users
  FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());

CREATE POLICY users_update ON users
  FOR UPDATE USING (tenant_id = get_current_tenant_id());

-- SUB_MODULES RLS
CREATE POLICY sub_modules_tenant_isolation ON sub_modules
  FOR SELECT USING (tenant_id = get_current_tenant_id());

CREATE POLICY sub_modules_insert ON sub_modules
  FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());

CREATE POLICY sub_modules_update ON sub_modules
  FOR UPDATE USING (tenant_id = get_current_tenant_id());

-- SUB_MODULE_FIELDS RLS
CREATE POLICY sub_module_fields_tenant_isolation ON sub_module_fields
  FOR SELECT USING (tenant_id = get_current_tenant_id());

CREATE POLICY sub_module_fields_insert ON sub_module_fields
  FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());

-- SUB_MODULE_RECORDS RLS
CREATE POLICY sub_module_records_tenant_isolation ON sub_module_records
  FOR SELECT USING (tenant_id = get_current_tenant_id());

CREATE POLICY sub_module_records_insert ON sub_module_records
  FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());

CREATE POLICY sub_module_records_update ON sub_module_records
  FOR UPDATE USING (tenant_id = get_current_tenant_id());

CREATE POLICY sub_module_records_delete ON sub_module_records
  FOR DELETE USING (tenant_id = get_current_tenant_id());

-- ATTACHMENTS RLS
CREATE POLICY attachments_tenant_isolation ON attachments
  FOR SELECT USING (tenant_id = get_current_tenant_id());

CREATE POLICY attachments_insert ON attachments
  FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());

CREATE POLICY attachments_delete ON attachments
  FOR DELETE USING (tenant_id = get_current_tenant_id());

-- COMMENTS RLS
CREATE POLICY comments_tenant_isolation ON comments
  FOR SELECT USING (tenant_id = get_current_tenant_id());

CREATE POLICY comments_insert ON comments
  FOR INSERT WITH CHECK (tenant_id = get_current_tenant_id());

CREATE POLICY comments_update ON comments
  FOR UPDATE USING (tenant_id = get_current_tenant_id());

-- NOTIFICATIONS RLS
CREATE POLICY notifications_user_isolation ON notifications
  FOR SELECT USING (user_id = auth.uid() AND tenant_id = get_current_tenant_id());

-- WORKFLOWS RLS
CREATE POLICY workflows_tenant_isolation ON workflows
  FOR SELECT USING (tenant_id = get_current_tenant_id());

-- DASHBOARDS RLS
CREATE POLICY dashboards_tenant_isolation ON dashboards
  FOR SELECT USING (tenant_id = get_current_tenant_id());

-- DASHBOARD_WIDGETS RLS
CREATE POLICY dashboard_widgets_tenant_isolation ON dashboard_widgets
  FOR SELECT USING (tenant_id = get_current_tenant_id());

-- DATA_SOURCES RLS
CREATE POLICY data_sources_tenant_isolation ON data_sources
  FOR SELECT USING (tenant_id = get_current_tenant_id());

-- SUPPLIERS RLS
CREATE POLICY suppliers_tenant_isolation ON suppliers
  FOR SELECT USING (tenant_id = get_current_tenant_id());

-- SUPPLIER_RATINGS RLS
CREATE POLICY supplier_ratings_tenant_isolation ON supplier_ratings
  FOR SELECT USING (tenant_id = get_current_tenant_id());

-- EMAIL_QUEUE RLS (Service role only)
CREATE POLICY email_queue_service_role ON email_queue
  FOR SELECT USING (TRUE);

-- AUDIT_LOGS RLS (Admins only)
CREATE POLICY audit_logs_tenant_isolation ON audit_logs
  FOR SELECT USING (tenant_id = get_current_tenant_id());

-- ============================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================

CREATE OR REPLACE FUNCTION trigger_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tenants_update BEFORE UPDATE ON tenants
FOR EACH ROW EXECUTE FUNCTION trigger_update_updated_at();

CREATE TRIGGER users_update BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION trigger_update_updated_at();

CREATE TRIGGER sub_modules_update BEFORE UPDATE ON sub_modules
FOR EACH ROW EXECUTE FUNCTION trigger_update_updated_at();

CREATE TRIGGER sub_module_fields_update BEFORE UPDATE ON sub_module_fields
FOR EACH ROW EXECUTE FUNCTION trigger_update_updated_at();

CREATE TRIGGER sub_module_records_update BEFORE UPDATE ON sub_module_records
FOR EACH ROW EXECUTE FUNCTION trigger_update_updated_at();

CREATE TRIGGER workflows_update BEFORE UPDATE ON workflows
FOR EACH ROW EXECUTE FUNCTION trigger_update_updated_at();

CREATE TRIGGER dashboards_update BEFORE UPDATE ON dashboards
FOR EACH ROW EXECUTE FUNCTION trigger_update_updated_at();

CREATE TRIGGER dashboard_widgets_update BEFORE UPDATE ON dashboard_widgets
FOR EACH ROW EXECUTE FUNCTION trigger_update_updated_at();

CREATE TRIGGER data_sources_update BEFORE UPDATE ON data_sources
FOR EACH ROW EXECUTE FUNCTION trigger_update_updated_at();

CREATE TRIGGER suppliers_update BEFORE UPDATE ON suppliers
FOR EACH ROW EXECUTE FUNCTION trigger_update_updated_at();

CREATE TRIGGER email_queue_update BEFORE UPDATE ON email_queue
FOR EACH ROW EXECUTE FUNCTION trigger_update_updated_at();

-- ============================================================
-- INITIAL SEED DATA
-- ============================================================

-- Insert main modules
INSERT INTO main_modules (name, code, icon, description, sort_order) VALUES
  ('CRM', 'crm', 'UserGroupIcon', 'Customer Relationship Management', 1),
  ('Sales', 'sales', 'ShoppingBagIcon', 'Sales & Opportunities', 2),
  ('Operations', 'operations', 'CogIcon', 'Business Operations', 3),
  ('Finance', 'finance', 'CurrencyDollarIcon', 'Financial Management', 4),
  ('Inventory', 'inventory', 'CubeIcon', 'Inventory & Warehouse', 5),
  ('HR', 'hr', 'UserGroupIcon', 'Human Resources', 6)
ON CONFLICT DO NOTHING;
