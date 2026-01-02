# HOBOT Roadmap 2024-2025

Website : https://hobot-roadmap-hvckkqvx8-rimands-projects.vercel.app/

เว็บแอปพลิเคชันสำหรับแสดง Timeline และ Roadmap ของ HOBOT ตั้งแต่ปี 2024-2025 พร้อมฟีเจอร์การค้นหา กรองข้อมูล และแสดงรายละเอียดงานต่างๆ

**เวอร์ชันใหม่**: ใช้ Next.js พร้อม Server-side Authentication เพื่อความปลอดภัยของรหัสผ่าน

## ✨ ฟีเจอร์

### 🔐 Security
- **Server-side Password Authentication**: รหัสผ่านถูกตรวจสอบที่ server ด้วย bcrypt
- **Session Management**: ใช้ HTTP-only cookies สำหรับ session management
- **Environment Variables**: รหัสผ่าน hash ถูกเก็บใน environment variables

### 📅 Timeline
- แสดง Timeline แยกตามปี (2024 และ 2025)
- แยกประเภทงานและเหตุการณ์ด้วย badge สี
  - **งาน** (สีเขียว) - งานที่ออกหน้างานแล้วทำเงินจริงๆ
  - **เหตุการณ์** (สีเทา) - เหตุการณ์ที่เกิดขึ้น
- คลิกเพื่อขยายดูรายละเอียดงาน (Jobs)

### 🔍 Search & Filter
- **ค้นหา**: ค้นหา events, jobs, หรือ tags แบบ real-time พร้อม highlight ข้อความที่ค้นหา
- **กรองตาม Product**: กรองตามประเภทผลิตภัณฑ์ (Robot Arm, Linear Track, Turn Table, etc.)
- **กรองตาม Type**: กรองตามประเภทเหตุการณ์ (success, tech, event, milestone, team)
- แสดง active filters เป็น chips ที่สามารถลบได้

### 📊 Products Display
- แสดง 8 ผลิตภัณฑ์หลักของ HOBOT:
  - Robot Arm
  - Linear Track
  - Turn Table
  - Reveal Fabric
  - Stage Mobile
  - Sliding rail
  - Treadmill
  - Structure Accessory

### 📈 Product Statistics (2025)
- แสดงสถิติการใช้งานผลิตภัณฑ์แต่ละตัวในปี 2025
- แสดงเป็น progress bars พร้อมจำนวนครั้งที่ใช้งาน

### 🎨 UI/UX Features
- **Smooth Animations**: Fade-in และ slide-in animations
- **Hover Effects**: Interactive hover effects บน cards และ timeline items
- **Scroll to Top**: ปุ่มเลื่อนขึ้นด้านบน (แสดงเมื่อ scroll ลง)
- **Keyboard Navigation**:
  - `Escape` - ล้าง filters ทั้งหมด
  - `Ctrl + Up Arrow` - เลื่อนขึ้นด้านบน
- **Responsive Design**: รองรับการแสดงผลบน mobile, tablet, และ desktop
- **Print-friendly**: ซ่อน elements ที่ไม่จำเป็นเมื่อพิมพ์

## 🚀 การติดตั้งและใช้งาน

### Prerequisites
- Node.js 18+ 
- npm หรือ yarn

### ขั้นตอนการติดตั้ง

1. **Clone repository**
```bash
git clone <repository-url>
cd "HOBOT Roadmap"
```

2. **ติดตั้ง dependencies**
```bash
npm install
```

3. **สร้าง Password Hash**

สร้าง bcrypt hash สำหรับรหัสผ่านของคุณ:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your_password_here', 10).then(console.log);"
```

คัดลอก hash ที่ได้มา

4. **ตั้งค่า Environment Variables**

สร้างไฟล์ `.env.local`:
```bash
cp .env.example .env.local
```

แก้ไข `.env.local` และใส่ password hash:
```
PASSWORD_HASH=your_bcrypt_hash_here
NODE_ENV=development
```

5. **รัน Development Server**
```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

6. **Build สำหรับ Production**
```bash
npm run build
npm start
```

## 🛠️ เทคโนโลยีที่ใช้

- **Next.js 14** - React Framework with Server-side Rendering
- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **bcryptjs** - Password Hashing
- **Google Fonts (Anuphan)** - Thai Font

## 📁 โครงสร้างโปรเจกต์

```
HOBOT Roadmap/
├── pages/
│   ├── api/
│   │   └── auth/
│   │       ├── login.ts      # API endpoint สำหรับ login
│   │       ├── verify.ts     # API endpoint สำหรับ verify session
│   │       └── logout.ts     # API endpoint สำหรับ logout
│   ├── index.tsx             # หน้าแรก (Roadmap)
│   ├── login.tsx             # หน้า login
│   └── _app.tsx              # App wrapper
├── components/
│   └── Icons.tsx             # SVG Icons components
├── lib/
│   ├── auth.ts               # Client-side auth utilities
│   ├── data.ts               # Timeline data
│   └── sessions.ts           # Session management
├── styles/
│   └── globals.css            # Global styles
├── middleware.ts             # Next.js middleware สำหรับ route protection
├── package.json
├── next.config.js
├── tsconfig.json
└── tailwind.config.js
```

## 🔒 Security Features

1. **Password Hashing**: ใช้ bcrypt สำหรับ hashing รหัสผ่าน (ปลอดภัยกว่า SHA-256)
2. **HTTP-only Cookies**: Session tokens ถูกเก็บใน HTTP-only cookies เพื่อป้องกัน XSS attacks
3. **Server-side Validation**: การตรวจสอบรหัสผ่านทำที่ server เท่านั้น
4. **Environment Variables**: รหัสผ่าน hash ไม่ถูก commit ลง git
5. **Session Expiry**: Session หมดอายุหลังจาก 24 ชั่วโมง

## 📝 ข้อมูลที่แสดง

### ปี 2024
- 5 งาน
- 8 เหตุการณ์สำคัญ

### ปี 2025
- 17 งาน
- 12 เหตุการณ์สำคัญ

## 🎯 Event Types

- **success** - เหตุการณ์ที่สำเร็จ (สีเขียว)
- **tech** - เหตุการณ์ทางเทคนิค (สีน้ำเงิน)
- **event** - เหตุการณ์ทั่วไป (สีเทา)
- **milestone** - จุดสำคัญ (สีม่วง)
- **team** - เหตุการณ์เกี่ยวกับทีม (สีส้ม)

## 📱 Browser Support

- Chrome (แนะนำ)
- Firefox
- Safari
- Edge

## 🚨 หมายเหตุสำคัญ

- **อย่าลืมตั้งค่า PASSWORD_HASH ใน .env.local** ก่อนรันแอปพลิเคชัน
- ใน production ควรใช้ Redis หรือ database สำหรับ session storage แทนการใช้ in-memory Map
- ควรใช้ HTTPS ใน production environment

## 📄 License

โปรเจกต์นี้เป็นของ HOBOT

## 👥 ผู้พัฒนา

HOBOT Team

---

**หมายเหตุ**: เวอร์ชันนี้ใช้ Next.js และมี server-side authentication เพื่อความปลอดภัยที่มากขึ้น
