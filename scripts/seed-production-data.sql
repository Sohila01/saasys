-- ============================================================
-- Nexus SaaS Platform - Test Data Initialization Script
-- ============================================================
-- Run this in Supabase SQL Editor to populate test data

-- 1. Create Test Tenant
INSERT INTO tenants (id, name, domain, created_at, updated_at) 
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Test Company Inc.',
  'test-company.example.com',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- 2. Create Test User (email: test@example.com, password: Test123!@#)
-- Note: User must be created via Supabase Auth UI or API, then update profile
UPDATE users 
SET 
  tenant_id = '550e8400-e29b-41d4-a716-446655440000',
  full_name = 'Test Admin',
  role = 'admin',
  updated_at = NOW()
WHERE email = 'test@example.com';

-- 3. Create Main Modules
INSERT INTO main_modules (id, name, code, description, icon, sort_order, created_at, updated_at)
VALUES 
  ('111e8400-e29b-41d4-a716-446655440001', 'Sales', 'sales', 'Sales Management', 'shopping-bag', 1, NOW(), NOW()),
  ('111e8400-e29b-41d4-a716-446655440002', 'Inventory', 'inventory', 'Inventory Management', 'cube', 2, NOW(), NOW()),
  ('111e8400-e29b-41d4-a716-446655440003', 'Customers', 'customers', 'Customer Management', 'users', 3, NOW(), NOW()),
  ('111e8400-e29b-41d4-a716-446655440004', 'Suppliers', 'suppliers', 'Supplier Management', 'building-office-2', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 4. Create Sub Modules
INSERT INTO sub_modules (
  id, tenant_id, name, code, main_module_id, description, icon, 
  display_name_singular, display_name_plural, created_at, updated_at
)
VALUES 
  -- Sales Module
  ('220e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Products', 'products', '111e8400-e29b-41d4-a716-446655440001', 'Product Catalog', 'cube', 'Product', 'Products', NOW(), NOW()),
  ('220e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Orders', 'orders', '111e8400-e29b-41d4-a716-446655440001', 'Sales Orders', 'receipt', 'Order', 'Orders', NOW(), NOW()),
  ('220e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Invoices', 'invoices', '111e8400-e29b-41d4-a716-446655440001', 'Sales Invoices', 'document', 'Invoice', 'Invoices', NOW(), NOW()),
  
  -- Inventory Module
  ('220e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Stock Levels', 'stock_levels', '111e8400-e29b-41d4-a716-446655440002', 'Current Stock', 'scale', 'Stock Level', 'Stock Levels', NOW(), NOW()),
  ('220e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'Warehouses', 'warehouses', '111e8400-e29b-41d4-a716-446655440002', 'Warehouse Locations', 'building', 'Warehouse', 'Warehouses', NOW(), NOW()),
  
  -- Customers Module
  ('220e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', 'Accounts', 'accounts', '111e8400-e29b-41d4-a716-446655440003', 'Customer Accounts', 'users', 'Account', 'Accounts', NOW(), NOW()),
  ('220e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440000', 'Contacts', 'contacts', '111e8400-e29b-41d4-a716-446655440003', 'Customer Contacts', 'phone', 'Contact', 'Contacts', NOW(), NOW()),
  
  -- Suppliers Module
  ('220e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440000', 'Vendors', 'vendors', '111e8400-e29b-41d4-a716-446655440004', 'Vendor List', 'building', 'Vendor', 'Vendors', NOW(), NOW()),
  ('220e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440000', 'Purchase Orders', 'purchase_orders', '111e8400-e29b-41d4-a716-446655440004', 'Purchase Orders', 'document', 'PO', 'POs', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 5. Create Sample Products
INSERT INTO records (id, sub_module_id, tenant_id, data, created_at, updated_at)
VALUES 
  ('330e8400-e29b-41d4-a716-446655440001', '220e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 
    '{"name": "Laptop Pro 16", "sku": "LAPTOP-001", "price": 1999.99, "category": "Electronics", "stock": 45}', NOW(), NOW()),
  ('330e8400-e29b-41d4-a716-446655440002', '220e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000',
    '{"name": "USB-C Cable 2M", "sku": "USB-002", "price": 24.99, "category": "Accessories", "stock": 320}', NOW(), NOW()),
  ('330e8400-e29b-41d4-a716-446655440003', '220e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000',
    '{"name": "Wireless Mouse", "sku": "MOUSE-003", "price": 49.99, "category": "Peripherals", "stock": 150}', NOW(), NOW()),
  ('330e8400-e29b-41d4-a716-446655440004', '220e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000',
    '{"name": "Monitor 4K 27\"", "sku": "MON-004", "price": 699.99, "category": "Electronics", "stock": 28}', NOW(), NOW()),
  ('330e8400-e29b-41d4-a716-446655440005', '220e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000',
    '{"name": "Mechanical Keyboard", "sku": "KBD-005", "price": 149.99, "category": "Peripherals", "stock": 87}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 6. Create Sample Orders
INSERT INTO records (id, sub_module_id, tenant_id, data, created_at, updated_at)
VALUES 
  ('330e8400-e29b-41d4-a716-446655440101', '220e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000',
    '{"order_number": "ORD-2024-001", "customer": "Acme Corp", "total": 2074.98, "status": "completed", "date": "2024-01-15"}', NOW(), NOW()),
  ('330e8400-e29b-41d4-a716-446655440102', '220e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000',
    '{"order_number": "ORD-2024-002", "customer": "Tech Solutions", "total": 3199.97, "status": "pending", "date": "2024-01-18"}', NOW(), NOW()),
  ('330e8400-e29b-41d4-a716-446655440103', '220e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000',
    '{"order_number": "ORD-2024-003", "customer": "Global Industries", "total": 749.98, "status": "processing", "date": "2024-01-20"}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 7. Create Sample Customers
INSERT INTO records (id, sub_module_id, tenant_id, data, created_at, updated_at)
VALUES 
  ('330e8400-e29b-41d4-a716-446655440201', '220e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000',
    '{"name": "Acme Corporation", "industry": "Manufacturing", "revenue": 50000000, "employees": 1200, "status": "active"}', NOW(), NOW()),
  ('330e8400-e29b-41d4-a716-446655440202', '220e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000',
    '{"name": "Tech Solutions Inc", "industry": "IT Services", "revenue": 25000000, "employees": 450, "status": "active"}', NOW(), NOW()),
  ('330e8400-e29b-41d4-a716-446655440203', '220e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000',
    '{"name": "Global Industries Ltd", "industry": "Retail", "revenue": 100000000, "employees": 5000, "status": "active"}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 8. Create Sample Dashboard
INSERT INTO dashboards (id, tenant_id, name, description, config, created_at, updated_at)
VALUES (
  '440e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440000',
  'Executive Summary',
  'High-level overview of business metrics',
  '{"layout": "grid", "refresh_interval": 60, "theme": "light"}',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- 9. Create Sample Workflows
INSERT INTO workflows (id, tenant_id, name, description, config, status, created_at, updated_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'New Order Fulfillment', 'Automated order processing workflow', '{"trigger": "new_order", "steps": ["validate", "ship", "notify"]}', 'active', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Customer Onboarding', 'New customer welcome workflow', '{"trigger": "new_customer", "steps": ["welcome", "setup", "training"]}', 'active', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 10. Verify data was inserted
SELECT 
  (SELECT COUNT(*) FROM tenants) as tenant_count,
  (SELECT COUNT(*) FROM users WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440000') as user_count,
  (SELECT COUNT(*) FROM sub_modules WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440000') as module_count,
  (SELECT COUNT(*) FROM records WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440000') as record_count;

