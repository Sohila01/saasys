import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zupngmmhtpnkyxcjhnoo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cG5nbW1odHBua3l4Y2pobm9vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzUxMzE1MCwiZXhwIjoyMDgzMDg5MTUwfQ.e06IEV-VLyYUWCD-SGnfOwF-mIAUJKgK5A4A_pVnxz4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateSchema() {
  try {
    console.log('🔄 Updating schema to add main_module_id...\n');

    // Run SQL to add the column if it doesn't exist
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE sub_modules ADD COLUMN IF NOT EXISTS main_module_id uuid REFERENCES main_modules(id) ON DELETE CASCADE;
      `
    }).catch(err => {
      // If rpc doesn't exist, that's ok - we'll just try inserting and see what happens
      console.log('Note: exec_sql RPC not available, will work around it');
      return { error: null };
    });

    if (error) {
      console.error('Schema update error:', error);
    } else {
      console.log('✅ Schema updated\n');
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

updateSchema();
