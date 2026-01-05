#!/usr/bin/env node

import https from 'https';

const RENDER_TOKEN = 'rnd_U4njDwWnWGQ7ArjRKfdnK9ZsQC4Q';

function makeRequest(method, path) {
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
    req.end();
  });
}

async function deployBackend() {
  console.log('🚀 Getting Render Account Info...\n');

  try {
    // Get owners
    console.log('1️⃣  Fetching your Render account...');
    const ownersRes = await makeRequest('GET', '/owners');
    
    if (ownersRes.status !== 200) {
      console.error('❌ Failed to get owners:', ownersRes.data);
      process.exit(1);
    }

    const owners = ownersRes.data;
    console.log('✅ Account found!');
    
    if (!owners || (Array.isArray(owners) && owners.length === 0)) {
      console.error('❌ No owners found. Please check your token.');
      process.exit(1);
    }

    const ownerData = Array.isArray(owners) ? owners[0] : owners;
    const owner = ownerData.owner || ownerData;
    console.log(`\n👤 Owner: ${owner.name}`);
    console.log(`   ID: ${owner.id}`);

    console.log('\n✨ Your account is ready for deployment!');
    console.log('\n📝 Use this Owner ID for API deployments:');
    console.log(`   ${owner.id}`);

    console.log('\n🎯 To deploy Backend:');
    console.log('1. Go to https://dashboard.render.com');
    console.log('2. Click "New +" → "Web Service"');
    console.log('3. Connect repository: Sohila01/saasys');
    console.log('4. Select branch: master');
    console.log('5. Root directory: backend');
    console.log('6. Add Environment Variables (see RENDER_QUICK_START.md)');
    console.log('7. Click "Create Web Service"');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

deployBackend();
