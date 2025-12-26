#!/usr/bin/env node

/**
 * Script สำหรับแก้ไข .env.local ให้ hash ถูกต้อง
 * ใส่ quotes รอบ hash เพื่อป้องกันปัญหา $ ถูกตีความเป็นตัวแปร
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');

if (!fs.existsSync(envPath)) {
  console.error('❌ ไม่พบไฟล์ .env.local');
  process.exit(1);
}

let content = fs.readFileSync(envPath, 'utf8');

// หา hash ที่มีอยู่
const hashMatch = content.match(/PASSWORD_HASH=(.+?)(?:\r?\n|$)/);
if (!hashMatch) {
  console.error('❌ ไม่พบ PASSWORD_HASH ใน .env.local');
  process.exit(1);
}

const hash = hashMatch[1].trim();

// ตรวจสอบว่า hash ถูกต้อง
if (!hash.startsWith('$2a$') && !hash.startsWith('$2b$')) {
  console.error('❌ Hash format ไม่ถูกต้อง');
  console.error('Hash ที่พบ:', hash.substring(0, 20) + '...');
  process.exit(1);
}

// สร้าง content ใหม่โดยใส่ quotes รอบ hash
const newContent = `# Password Hash
# Create hash with: npm run generate-hash
PASSWORD_HASH="${hash}"

# Node Environment
NODE_ENV=development
`;

fs.writeFileSync(envPath, newContent, 'utf8');

console.log('✅ แก้ไข .env.local สำเร็จแล้ว!');
console.log('Hash length:', hash.length);
console.log('Hash starts with:', hash.substring(0, 7));
console.log('\n⚠️  อย่าลืม RESTART Next.js server!');

