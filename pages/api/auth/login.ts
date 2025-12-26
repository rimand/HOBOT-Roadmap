import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import { setSession } from '../../../lib/sessions';
import fs from 'fs';
import path from 'path';

// Function เพื่อโหลด hash จาก .env.local โดยตรง (เพื่อแก้ปัญหา $ ถูกตีความเป็นตัวแปร)
function loadPasswordHash(): string {
  // ลองใช้ environment variable ก่อน
  let hash = process.env.PASSWORD_HASH || '';
  
  // ถ้า hash ไม่ถูกต้อง (ไม่เริ่มด้วย $2a$ หรือ $2b$) ให้โหลดจากไฟล์โดยตรง
  if (!hash.startsWith('$2a$') && !hash.startsWith('$2b$')) {
    try {
      const envPath = path.join(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const match = content.match(/PASSWORD_HASH=["']?([^"'\r\n]+)["']?/);
        if (match && match[1]) {
          hash = match[1].trim();
        }
      }
    } catch (error) {
      console.error('Error loading hash from file:', error);
    }
  }
  
  return hash.trim().replace(/^["']|["']$/g, '');
}

// Password hash จะถูกเก็บใน environment variable หรือโหลดจากไฟล์
const CORRECT_PASSWORD_HASH = loadPasswordHash();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (!CORRECT_PASSWORD_HASH) {
    console.error('PASSWORD_HASH environment variable is not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Debug: ตรวจสอบ hash (ไม่แสดงทั้งหมดเพื่อความปลอดภัย)
  if (process.env.NODE_ENV === 'development') {
    console.log('=== LOGIN DEBUG ===');
    console.log('Raw env PASSWORD_HASH:', process.env.PASSWORD_HASH ? process.env.PASSWORD_HASH.substring(0, 30) + '...' : 'NOT SET');
    console.log('Raw env length:', process.env.PASSWORD_HASH?.length || 0);
    console.log('Loaded hash:', CORRECT_PASSWORD_HASH.substring(0, 30) + '...');
    console.log('Loaded hash length:', CORRECT_PASSWORD_HASH.length);
    console.log('Hash starts with:', CORRECT_PASSWORD_HASH.substring(0, 7));
    console.log('Password received length:', password.length);
    console.log('Password first char:', password.substring(0, 1));
    console.log('==================');
  }

  // ตรวจสอบว่า hash ถูกต้อง (bcrypt hash ควรเริ่มด้วย $2a$ หรือ $2b$ และยาว 60 ตัวอักษร)
  if (!CORRECT_PASSWORD_HASH.startsWith('$2a$') && !CORRECT_PASSWORD_HASH.startsWith('$2b$')) {
    console.error('Invalid hash format. Hash should start with $2a$ or $2b$');
    console.error('Hash received:', CORRECT_PASSWORD_HASH.substring(0, 20) + '...');
    return res.status(500).json({ error: 'Server configuration error: Invalid hash format' });
  }

  try {
    // เปรียบเทียบ password ด้วย bcrypt (ปลอดภัยกว่า SHA-256)
    const isValid = await bcrypt.compare(password, CORRECT_PASSWORD_HASH);

    if (isValid) {
      // สร้าง session token
      const sessionToken = generateSessionToken();
      const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 ชั่วโมง

      setSession(sessionToken, expiry);
      
      // Debug: verify session was set
      if (process.env.NODE_ENV === 'development') {
        const { getSession } = await import('../../../lib/sessions');
        const verifySession = getSession(sessionToken);
        console.log('Session verification after set:', verifySession ? 'SUCCESS' : 'FAILED');
        if (verifySession) {
          console.log('Session expiry set to:', new Date(verifySession.expiry).toISOString());
        }
      }

      // ตั้งค่า cookie
      const cookie = serialize('hobot_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 ชั่วโมง
        path: '/',
      });

      res.setHeader('Set-Cookie', cookie);
      
      // Debug: log cookie ที่ถูก set
      if (process.env.NODE_ENV === 'development') {
        console.log('Cookie set:', cookie.substring(0, 50) + '...');
        console.log('Session token:', sessionToken.substring(0, 20) + '...');
        console.log('Full session token:', sessionToken);
      }
      
      return res.status(200).json({ success: true });
    } else {
      // ใช้ delay เพื่อป้องกัน timing attack
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log('Password comparison failed');
      return res.status(401).json({ error: 'รหัสผ่านไม่ถูกต้อง' });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function generateSessionToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36);
}

