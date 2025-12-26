#!/usr/bin/env node

/**
 * Script สำหรับทดสอบ password hash
 * ใช้เพื่อตรวจสอบว่า password และ hash ตรงกันหรือไม่
 */

const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// อ่าน hash จาก .env.local
const envPath = path.join(__dirname, '..', '.env.local');
let passwordHash = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/PASSWORD_HASH=(.+)/);
  if (match) {
    passwordHash = match[1].trim();
    console.log('✅ พบ hash ใน .env.local');
    console.log('Hash (first 30 chars):', passwordHash.substring(0, 30) + '...');
    console.log('Hash length:', passwordHash.length);
  } else {
    console.error('❌ ไม่พบ PASSWORD_HASH ใน .env.local');
    process.exit(1);
  }
} else {
  console.error('❌ ไม่พบไฟล์ .env.local');
  process.exit(1);
}

// รับ password จาก command line หรือถาม
const password = process.argv[2];

if (!password) {
  console.error('❌ กรุณาระบุ password: node scripts/test-password.js your_password');
  process.exit(1);
}

// ทดสอบ
console.log('\n🔍 กำลังทดสอบ password...');
console.log('Password length:', password.length);

bcrypt.compare(password, passwordHash)
  .then(isValid => {
    if (isValid) {
      console.log('\n✅ Password ถูกต้อง! Hash ทำงานได้ดี');
    } else {
      console.log('\n❌ Password ไม่ถูกต้อง');
      console.log('กรุณาตรวจสอบว่า:');
      console.log('  1. Password ที่ใส่ตรงกับที่ใช้สร้าง hash');
      console.log('  2. Hash ใน .env.local ถูกต้อง');
      console.log('  3. Restart Next.js server หลังจากแก้ไข .env.local');
    }
    process.exit(isValid ? 0 : 1);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });

