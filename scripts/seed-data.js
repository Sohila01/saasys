import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zupngmmhtpnkyxcjhnoo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cG5nbW1odHBua3l4Y2pobm9vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzUxMzE1MCwiZXhwIjoyMDgzMDg5MTUwfQ.e06IEV-VLyYUWCD-SGnfOwF-mIAUJKgK5A4A_pVnxz4';

const supabase = createClient(supabaseUrl, supabaseKey);

const userId = '8475d9af-2eb1-416a-8342-577a27b1cec8'; // test@demo.com user ID

async function seed() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // 1. Get or create a default tenant
    console.log('Getting or creating tenant...');
    let { data: existingTenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('subdomain', 'demo')
      .single();

    let tenantId;
    if (existingTenant) {
      tenantId = existingTenant.id;
      console.log('✅ Using existing tenant:', tenantId);
    } else {
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .insert([
          {
            name: 'Demo Organization',
            subdomain: 'demo',
            settings: { theme: 'dark', language: 'en' }
          }
        ])
        .select()
        .single();

      if (tenantError) {
        console.error('Tenant creation error:', tenantError);
        return;
      }
      tenantId = tenantData.id;
      console.log('✅ Tenant created:', tenantId);
    }

    // 2. Create user profile if it doesn't exist
    console.log('\nCreating user profile...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: userId,
          tenant_id: tenantId,
          full_name: 'Test User',
          email: 'test@demo.com',
          role: 'tenant_admin'
        }
      ])
      .select()
      .single();

    if (userError) {
      if (userError.code === '23505') {
        console.log('✅ User profile already exists');
      } else {
        console.error('User creation error:', userError);
        return;
      }
    } else {
      console.log('✅ User profile created');
    }

    // 3. Create main modules
    console.log('\nCreating main modules...');
    const mainModules = [
      { name: 'CRM', icon: 'UserGroupIcon', sort_order: 1 },
      { name: 'Sales', icon: 'ShoppingBagIcon', sort_order: 2 },
      { name: 'Operations', icon: 'CogIcon', sort_order: 3 },
      { name: 'Finance', icon: 'CurrencyDollarIcon', sort_order: 4 }
    ];

    const { data: moduleData, error: moduleError } = await supabase
      .from('main_modules')
      .insert(mainModules)
      .select();

    if (moduleError) {
      console.error('Module creation error:', moduleError);
      return;
    }
    console.log('✅ Main modules created:', moduleData.map(m => m.name).join(', '));

    // 4. Create sub modules
    console.log('\nCreating sub modules...');
    const subModules = [
      { tenant_id: tenantId, name: 'Contacts', code: 'contacts', settings: {} },
      { tenant_id: tenantId, name: 'Accounts', code: 'accounts', settings: {} },
      { tenant_id: tenantId, name: 'Opportunities', code: 'opportunities', settings: {} },
      { tenant_id: tenantId, name: 'Quotes', code: 'quotes', settings: {} }
    ];

    const { data: subModuleDataResult, error: subModuleError } = await supabase
      .from('sub_modules')
      .insert(subModules)
      .select();

    let subModuleData = subModuleDataResult;

    if (subModuleError) {
      if (subModuleError.code === '23505') {
        console.log('✅ Sub modules already exist (some duplicates skipped)');
        // Fetch existing ones
        const { data: existing } = await supabase
          .from('sub_modules')
          .select('*')
          .eq('tenant_id', tenantId);
        subModuleData = existing || [];
      } else {
        console.error('Sub module creation error:', subModuleError);
        return;
      }
    } else {
      console.log('✅ Sub modules created:', subModuleData.map(m => m.name).join(', '));
    }

    // 5. Create fields for Contacts
    console.log('\nCreating fields for Contacts module...');
    const contactsModule = subModuleData.find(m => m.code === 'contacts');
    
    const contactFields = [
      { sub_module_id: contactsModule.id, tenant_id: tenantId, name: 'First Name', db_name: 'first_name', field_type: 'text', is_required: true, is_visible_in_list: true, sort_order: 0 },
      { sub_module_id: contactsModule.id, tenant_id: tenantId, name: 'Last Name', db_name: 'last_name', field_type: 'text', is_required: true, is_visible_in_list: true, sort_order: 1 },
      { sub_module_id: contactsModule.id, tenant_id: tenantId, name: 'Email', db_name: 'email', field_type: 'text', is_required: true, is_visible_in_list: true, sort_order: 2 },
      { sub_module_id: contactsModule.id, tenant_id: tenantId, name: 'Phone', db_name: 'phone', field_type: 'text', is_required: false, is_visible_in_list: true, sort_order: 3 },
      { sub_module_id: contactsModule.id, tenant_id: tenantId, name: 'Company', db_name: 'company', field_type: 'text', is_required: false, is_visible_in_list: true, sort_order: 4 }
    ];

    const { error: fieldError } = await supabase
      .from('sub_module_fields')
      .insert(contactFields);

    if (fieldError) {
      console.error('Field creation error:', fieldError);
      return;
    }
    console.log('✅ Contact fields created');

    // 6. Create sample records
    console.log('\nCreating sample contact records...');
    const contacts = [
      { sub_module_id: contactsModule.id, tenant_id: tenantId, data: { first_name: 'John', last_name: 'Doe', email: 'john@example.com', phone: '555-0101', company: 'Acme Inc' } },
      { sub_module_id: contactsModule.id, tenant_id: tenantId, data: { first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', phone: '555-0102', company: 'Tech Corp' } },
      { sub_module_id: contactsModule.id, tenant_id: tenantId, data: { first_name: 'Bob', last_name: 'Johnson', email: 'bob@example.com', phone: '555-0103', company: 'Global Ltd' } }
    ];

    const { error: recordError } = await supabase
      .from('sub_module_records')
      .insert(contacts);

    if (recordError) {
      console.error('Record creation error:', recordError);
      return;
    }
    console.log('✅ Sample contact records created');

    // 7. Create dashboard
    console.log('\nCreating dashboard...');
    const { data: dashboardData, error: dashboardError } = await supabase
      .from('dashboards')
      .insert([
        {
          tenant_id: tenantId,
          name: 'Executive Overview',
          is_default: true
        }
      ])
      .select()
      .single();

    if (dashboardError) {
      console.error('Dashboard creation error:', dashboardError);
      return;
    }
    console.log('✅ Dashboard created');

    // 8. Create dashboard widgets
    console.log('\nCreating dashboard widgets...');
    const widgets = [
      { dashboard_id: dashboardData.id, tenant_id: tenantId, name: 'Total Contacts', widget_type: 'metric', config: { value: 3, unit: 'contacts' }, position: { x: 0, y: 0, w: 4, h: 2 } },
      { dashboard_id: dashboardData.id, tenant_id: tenantId, name: 'Monthly Revenue', widget_type: 'chart', config: { type: 'bar' }, position: { x: 4, y: 0, w: 4, h: 2 } },
      { dashboard_id: dashboardData.id, tenant_id: tenantId, name: 'Pipeline Status', widget_type: 'chart', config: { type: 'pie' }, position: { x: 0, y: 2, w: 4, h: 3 } }
    ];

    const { error: widgetError } = await supabase
      .from('dashboard_widgets')
      .insert(widgets);

    if (widgetError) {
      console.error('Widget creation error:', widgetError);
      return;
    }
    console.log('✅ Dashboard widgets created');

    console.log('\n✨ Database seeding completed successfully!\n');
    console.log('📊 Seed Summary:');
    console.log('  - 1 Tenant');
    console.log('  - 1 User Profile');
    console.log('  - 4 Main Modules');
    console.log('  - 4 Sub Modules');
    console.log('  - 5 Contact Fields');
    console.log('  - 3 Sample Contacts');
    console.log('  - 1 Dashboard with 3 Widgets');

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

seed();
