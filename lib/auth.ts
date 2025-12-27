// Client-side authentication utilities for static export (GitHub Pages)
// หมายเหตุ: การตรวจสอบรหัสผ่านที่ client-side ไม่ปลอดภัยเท่า server-side
// แต่จำเป็นสำหรับ static hosting เช่น GitHub Pages

const AUTH_KEY = 'hobot_authenticated';
const AUTH_EXPIRY_KEY = 'hobot_auth_expiry';

// รหัสผ่านที่ใช้ (สำหรับ demo - ในโปรเจกต์จริงควรใช้ server-side auth)
// คุณสามารถเปลี่ยนรหัสผ่านได้ที่นี่
const CORRECT_PASSWORD = 'hlab1234';

export function verifySession(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const isAuthenticated = localStorage.getItem(AUTH_KEY);
    const expiry = localStorage.getItem(AUTH_EXPIRY_KEY);
    
    if (isAuthenticated === 'true' && expiry) {
      const expiryTime = parseInt(expiry, 10);
      if (Date.now() < expiryTime) {
        return true;
      } else {
        // Session expired
        clearSession();
      }
    }
    return false;
  } catch (error) {
    console.error('Session verification error:', error);
    return false;
  }
}

export function login(password: string): { success: boolean; error?: string } {
  try {
    if (password === CORRECT_PASSWORD) {
      // Set session for 24 hours
      const expiry = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem(AUTH_EXPIRY_KEY, expiry.toString());
      return { success: true };
    } else {
      return { success: false, error: 'รหัสผ่านไม่ถูกต้อง' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' };
  }
}

export function logout(): void {
  clearSession();
  window.location.href = '/login';
}

function clearSession(): void {
  try {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_EXPIRY_KEY);
  } catch (error) {
    console.error('Clear session error:', error);
  }
}

