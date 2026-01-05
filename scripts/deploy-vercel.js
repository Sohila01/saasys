#!/usr/bin/env node

const { execSync } = require('child_process');

const token = 'vck_1tkz4AFcquLU2cuA54Of2YNVYvbWnJUC2wa5zzKaeDeubuTcQb0zGptb';
const env = {
  VERCEL_TOKEN: token,
  VERCEL_PROJECT_ID: '',
  VERCEL_ORG_ID: 'walidgenidy-7419s'
};

const variables = [
  { name: 'VITE_API_URL', value: 'https://nexus-saas-backend.up.railway.app/api' },
  { name: 'VITE_SUPABASE_URL', value: 'https://zupngmmhtpnkyxcjhnoo.supabase.co' },
  { name: 'VITE_SUPABASE_ANON_KEY', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cG5nbW1odHBua3l4Y2pobm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MTMxNTAsImV4cCI6MjA4MzA4OTE1MH0.IL2FxjVD5bJ6JUBDP2ZPBaWxZ6L6B206ovEpbhUIilg' }
];

console.log('🚀 Deploying to Vercel...');

try {
  // Deploy
  const deployCmd = `vercel --token ${token} --prod`;
  console.log('📦 Building and deploying...');
  execSync(deployCmd, { 
    cwd: 'c:\\Users\\Walid Genidy\\Desktop\\nexus-saas-platform',
    stdio: 'inherit' 
  });
  
  console.log('\n✅ Deployment successful!');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
