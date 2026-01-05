#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

const RAILWAY_TOKEN = 'd399a7b7-5399-42fb-b904-eb3df186180e';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.railway.app',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${RAILWAY_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': data ? Buffer.byteLength(JSON.stringify(data)) : 0,
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(body),
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
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function deployBackend() {
  console.log('🚀 Railway Backend Deployment\n');

  try {
    // Create project
    console.log('1️⃣  Creating Railway project...');
    const createProjectRes = await makeRequest('POST', '/graphql', {
      query: `mutation { projectCreate(input: { name: "Nexus SaaS Backend" }) { project { id name } } }`,
    });

    if (createProjectRes.status !== 200) {
      throw new Error(`Failed to create project: ${JSON.stringify(createProjectRes.data)}`);
    }

    console.log('✅ Project created');
    console.log('\n📋 Next steps:');
    console.log('1. Go to https://railway.app');
    console.log('2. Add your GitHub repository');
    console.log('3. Select "backend" directory');
    console.log('4. Add environment variables (see RAILWAY_DEPLOYMENT_GUIDE.md)');
    console.log('5. Click Deploy');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

deployBackend();
