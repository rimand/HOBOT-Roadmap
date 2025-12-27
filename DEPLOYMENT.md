# คู่มือการ Deploy ไปยัง GitHub Pages

## ⚠️ ข้อจำกัดสำคัญ

โปรเจกต์นี้ใช้ **server-side features** ของ Next.js ซึ่ง GitHub Pages **ไม่รองรับ** เพราะ GitHub Pages เป็น static hosting เท่านั้น

ฟีเจอร์ที่ต้องแก้ไข:
- ❌ `getServerSideProps` - ต้องเปลี่ยนเป็น `getStaticProps` หรือใช้ client-side
- ❌ API Routes (`/api/*`) - ต้องย้ายไปใช้ external service หรือ client-side
- ❌ Middleware - ต้องใช้ client-side protection แทน

## 📋 ขั้นตอนการ Deploy

### 1. ตั้งค่า GitHub Repository

1. ไปที่ GitHub repository ของคุณ
2. ไปที่ **Settings** → **Pages**
3. ตั้งค่า **Source** เป็น **GitHub Actions**

### 2. ตั้งค่า GitHub Secrets (สำหรับ PASSWORD_HASH)

1. ไปที่ **Settings** → **Secrets and variables** → **Actions**
2. คลิก **New repository secret**
3. ตั้งชื่อว่า `PASSWORD_HASH` และใส่ bcrypt hash ของรหัสผ่านของคุณ
4. คลิก **Add secret**

**วิธีสร้าง Password Hash:**
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your_password_here', 10).then(console.log);"
```

### 3. ตั้งค่า Base Path (ถ้าจำเป็น)

ถ้า repository ชื่อ `HOBOT-Roadmap` (มี dash หรือ space) คุณต้องตั้งค่า base path:

1. แก้ไขไฟล์ `next.config.js`:
```javascript
basePath: '/HOBOT-Roadmap', // เปลี่ยนเป็นชื่อ repository ของคุณ
```

2. หรือตั้งค่า environment variable ใน GitHub Actions:
   - ไปที่ **Settings** → **Secrets and variables** → **Actions** → **Variables**
   - เพิ่ม `NEXT_PUBLIC_BASE_PATH` = `/ชื่อ-repository-ของคุณ`

### 4. Push Code ไปยัง GitHub

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

### 5. ตรวจสอบ Deployment

1. ไปที่ **Actions** tab ใน GitHub repository
2. รอให้ workflow เสร็จสิ้น
3. ไปที่ **Settings** → **Pages** เพื่อดู URL ของเว็บไซต์

## 🔧 การแก้ไขให้รองรับ Static Export

### 1. แก้ไข `pages/index.tsx`

เปลี่ยนจาก `getServerSideProps` เป็น client-side authentication:

```typescript
// ลบ getServerSideProps และใช้ client-side check แทน
useEffect(() => {
  verifySession().then(isValid => {
    if (!isValid) {
      router.push('/login');
    }
  });
}, []);
```

### 2. แก้ไข `pages/login.tsx`

ลบ `getServerSideProps` และใช้ client-side redirect:

```typescript
useEffect(() => {
  verifySession().then(isValid => {
    if (isValid) {
      router.push('/');
    }
  });
}, []);
```

### 3. ย้าย Authentication ไป Client-side

เนื่องจาก API routes ไม่ทำงาน คุณต้อง:
- ใช้ localStorage หรือ sessionStorage แทน cookies
- ตรวจสอบรหัสผ่านที่ client-side (แต่ไม่ปลอดภัยเท่า server-side)
- หรือใช้ external authentication service

### 4. ลบ Middleware

ไฟล์ `middleware.ts` จะไม่ทำงานกับ static export - ลบหรือ comment ออก

## 🚀 ทางเลือกอื่น

### 1. Vercel (แนะนำ)
- รองรับ Next.js เต็มรูปแบบ (รวม server-side features)
- Deploy ฟรี
- ตั้งค่าอัตโนมัติ

### 2. Netlify
- รองรับ Next.js
- Deploy ฟรี
- ตั้งค่าอัตโนมัติ

### 3. Railway / Render
- รองรับ server-side features
- มี free tier

## 📝 หมายเหตุ

- GitHub Pages จะ build และ deploy อัตโนมัติเมื่อ push code
- ใช้เวลา 1-2 นาทีในการ deploy
- ถ้ามี error ตรวจสอบที่ **Actions** tab

