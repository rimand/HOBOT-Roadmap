#!/usr/bin/env node

/**
 * Script สำหรับสร้าง bcrypt hash สำหรับรหัสผ่าน
 * 
 * วิธีใช้:
 * node scripts/generate-password-hash.js your_password_here
 * 
 * หรือรันแบบ interactive:
 * node scripts/generate-password-hash.js
 */

const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function generateHash(password) {
  if (!password) {
    console.error('❌ Error: รหัสผ่านไม่สามารถว่างได้');
    process.exit(1);
  }

  bcrypt.hash(password, 10)
    .then(hash => {
      console.log('\n✅ Password hash ที่สร้างแล้ว:');
      console.log(hash);
      console.log('\n📋 คัดลอก hash นี้ไปใส่ในไฟล์ .env.local:');
      console.log(`PASSWORD_HASH=${hash}\n`);
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Error generating hash:', err);
      process.exit(1);
    });
}

// ตรวจสอบ arguments
const password = process.argv[2];

if (password) {
  // ใช้ password จาก command line
  generateHash(password);
} else {
  // ถามรหัสผ่านแบบ interactive
  rl.question('กรุณากรอกรหัสผ่าน: ', (password) => {
    rl.close();
    generateHash(password);
  });
}

