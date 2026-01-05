#!/usr/bin/env node

import https from 'https';

const RENDER_TOKEN = 'rnd_U4njDwWnWGQ7ArjRKfdnK9ZsQC4Q';
const OWNER_ID = 'tea-d5dgjuggjchc73dmh4c0';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.render.com',
      port: 443,
      path: `/v1${path}`,
      method: method,
      headers: {
        'Authorization': `Bearer ${RENDER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      const body = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(body);
    }

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: body ? JSON.parse(body) : null,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: body,
          });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      const body = JSON.stringify(data);
      req.write(body);
    }
    req.end();
  });
}

async function deployBackend() {
  console.log('🚀 Deploying Backend to Render...\n');

  try {
    console.log('1️⃣  Creating Render Web Service...');
    
    const serviceData = {
      name: 'nexus-saas-backend',
      ownerId: OWNER_ID,
      type: 'web_service',
      repo: 'https://github.com/Sohila01/saasys',
      branch: 'master',
      rootDir: 'backend',
      runtimeId: 'node',
      buildCommand: 'npm install && npm run build',
      startCommand: 'npm run start:prod',
      serviceDetails: {
        disk: null,
        env: 'node',
        envSpecificDetails: {
          nodeBuildDir: null,
          nodeVersion: '18',
          preDeployCommand: null,
        },
        healthCheckPath: null,
        openPorts: [],
      },
      envVars: [
        { key: 'NODE_ENV', value: 'production' },
        { key: 'PORT', value: '3000' },
        { key: 'SUPABASE_URL', value: 'https://zupngmmhtpnkyxcjhnoo.supabase.co' },
        { key: 'SUPABASE_SERVICE_KEY', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cG5nbW1odHBua3l4Y2pobm9vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzUxMzE1MCwiZXhwIjoyMDgzMDg5MTUwfQ.e06IEV-VLyYUWCD-SGnfOwF-mIAUJKgK5A4A_pVnxz4' },
        { key: 'SUPABASE_ANON_KEY', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cG5nbW1odHBua3l4Y2pobm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MTMxNTAsImV4cCI6MjA4MzA4OTE1MH0.IL2FxjVD5bJ6JUBDP2ZPBaWxZ6L6B206ovEpbhUIilg' },
        { key: 'JWT_SECRET', value: 'nexus-saas-platform-production-jwt-secret-2024-highly-secure-key' },
        { key: 'JWT_EXPIRATION', value: '7d' },
        { key: 'FRONTEND_URL', value: 'https://nexus-saas-platform.vercel.app' }
      ],
      plan: 'free'
    };

    const createRes = await makeRequest('POST', '/services', serviceData);
    
    if (createRes.status !== 201 && createRes.status !== 200) {
      console.error('Response status:', createRes.status);
      console.error('Response:', JSON.stringify(createRes.data, null, 2));
      throw new Error(`Failed to create service: ${createRes.status}`);
    }

    const service = createRes.data;
    console.log('✅ Service created successfully!\n');
    
    console.log('📊 Deployment Details:');
    console.log(`   Service ID: ${service.id}`);
    console.log(`   Name: ${service.name}`);
    console.log(`   Status: ${service.status}`);
    
    if (service.serviceDetails) {
      console.log(`   URL: https://${service.serviceDetails.url}`);
    }

    console.log('\n⏳ Deployment in progress...');
    console.log('   Estimated time: 2-5 minutes');
    console.log('\n🔗 Check progress at: https://dashboard.render.com');

    console.log('\n✨ Backend deployment started!');
    console.log('\n📝 Next Steps:');
    console.log('1. Wait for Render to build and deploy');
    console.log('2. You\'ll see a URL like: https://nexus-saas-backend.onrender.com');
    console.log('3. Update Vercel Environment Variables:');
    console.log('   VITE_API_URL=https://nexus-saas-backend.onrender.com/api');
    console.log('4. Redeploy on Vercel');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

deployBackend();
