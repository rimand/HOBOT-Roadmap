/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // สำหรับ GitHub Pages - ตั้งค่า basePath ตามชื่อ repository
  // ถ้า repository ชื่อ "HOBOT-Roadmap" ให้ใช้ basePath: '/HOBOT-Roadmap'
  // ถ้าใช้ custom domain หรือ root domain ให้ลบ basePath ออก
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // ใช้ static export สำหรับ GitHub Pages
  output: 'export',
  // ปิด image optimization เพราะ GitHub Pages เป็น static hosting
  images: {
    unoptimized: true,
  },
  // ปิด trailing slash
  trailingSlash: false,
}

module.exports = nextConfig

