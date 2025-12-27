import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { login, verifySession } from '../lib/auth';
import { Icons } from '../components/Icons';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = verifySession();
      if (authenticated) {
        router.push('/');
      } else {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = login(password);
      
      if (result.success) {
        console.log('Login successful, redirecting...');
        router.push('/');
      } else {
        setError(result.error || 'รหัสผ่านไม่ถูกต้อง');
        setPassword('');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      setPassword('');
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Icons.Cpu />
          </div>
          <p className="text-slate-600">กำลังตรวจสอบ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icons.Cpu />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">HOBOT Roadmap</h1>
          <p className="text-slate-600 text-sm">กรุณากรอกรหัสผ่านเพื่อเข้าถึง</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              รหัสผ่าน
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="กรอกรหัสผ่าน"
              autoFocus
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <Icons.Alert />
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all"
          >
            {isLoading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Static version สำหรับ GitHub Pages
          </p>
        </div>
      </div>
    </div>
  );
}
