# Migration Guide: จาก Client-side เป็น Server-side

## สิ่งที่เปลี่ยนแปลง

### 1. Architecture
- **เดิม**: Single HTML file with client-side React (Babel Standalone)
- **ใหม่**: Next.js application with server-side rendering

### 2. Password Security
- **เดิม**: Password hash ถูก obfuscate ใน client-side code (ไม่ปลอดภัย)
- **ใหม่**: Password hash ถูกเก็บใน environment variable และตรวจสอบที่ server ด้วย bcrypt

### 3. Authentication
- **เดิม**: localStorage-based session
- **ใหม่**: HTTP-only cookies with server-side session management

## ไฟล์ที่เปลี่ยนแปลง

### ไฟล์ใหม่
- `pages/` - Next.js pages และ API routes
- `components/` - React components
- `lib/` - Utility functions
- `styles/` - Global CSS
- `middleware.ts` - Route protection
- `package.json` - Dependencies
- `.env.example` - Environment variables template

### ไฟล์เดิม
- `index.html` - ถูกลบแล้ว (ไม่จำเป็น)

## การย้ายข้อมูล

ข้อมูล timeline และ products ถูกย้ายไปอยู่ใน `lib/data.ts` แล้ว

## ขั้นตอนการย้าย

1. ติดตั้ง dependencies: `npm install`
2. สร้าง password hash: `npm run generate-hash` หรือ `node scripts/generate-password-hash.js your_password`
3. ตั้งค่า `.env.local` ด้วย password hash
4. รันแอป: `npm run dev`

## ข้อดีของเวอร์ชันใหม่

1. ✅ **ความปลอดภัย**: รหัสผ่านไม่ถูก expose ใน client-side code
2. ✅ **Performance**: Server-side rendering ทำให้โหลดเร็วขึ้น
3. ✅ **SEO**: รองรับ SEO ได้ดีกว่า
4. ✅ **Type Safety**: ใช้ TypeScript
5. ✅ **Maintainability**: โครงสร้างโค้ดเป็นระเบียบมากขึ้น

