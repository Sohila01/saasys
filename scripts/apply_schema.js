#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');

async function main(){
  const sqlPath = path.join(__dirname, '..', 'full_schema.sql');
  if (!fs.existsSync(sqlPath)){
    console.error('full_schema.sql not found at', sqlPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');

  const pgHost = process.env.PGHOST || 'db.zupngmmhtpnkyxcjhnoo.supabase.co';
  const pgPort = process.env.PGPORT || 5432;
  const pgDatabase = process.env.PGDATABASE || 'postgres';
  const pgUser = process.env.PGUSER || 'postgres';
  const pgPassword = process.env.PGPASSWORD || process.env.DB_PASSWORD;

  if (!pgPassword){
    console.error('PGPASSWORD or DB_PASSWORD not provided in env');
    process.exit(1);
  }

  const client = new Client({
    host: pgHost,
    port: pgPort,
    database: pgDatabase,
    user: pgUser,
    password: pgPassword,
    ssl: { rejectUnauthorized: false }
  });

  try{
    console.log('Connecting to Postgres...');
    await client.connect();
    console.log('Running schema SQL... This may take a few seconds.');
    await client.query(sql);
    console.log('Schema applied successfully.');
  }catch(err){
    console.error('Error applying schema:', err.message || err);
    await client.end().catch(()=>{});
    process.exit(1);
  }

  // Create attachments bucket via Supabase Admin (service role)
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zupngmmhtpnkyxcjhnoo.supabase.co';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE;
  if (!supabaseServiceKey){
    console.warn('SUPABASE_SERVICE_ROLE not provided; skipping bucket creation.');
    await client.end();
    process.exit(0);
  }

  try{
    console.log('Creating Supabase client with service role key...');
    const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
    // Check existing buckets
    const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
    if (listErr) throw listErr;
    const exists = buckets.some(b => b.name === 'attachments');
    if (exists){
      console.log('Bucket `attachments` already exists.');
    } else {
      console.log('Creating bucket `attachments`...');
      const { data, error } = await supabase.storage.createBucket('attachments', { public: true });
      if (error) throw error;
      console.log('Bucket created:', data.name);
    }
  }catch(err){
    console.error('Error creating bucket:', err.message || err);
    await client.end().catch(()=>{});
    process.exit(1);
  }

  await client.end();
  console.log('All done.');
}

main();
