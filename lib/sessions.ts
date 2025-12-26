// Shared session storage for API routes
// ใน production ควรใช้ Redis หรือ database แทน

interface SessionData {
  expiry: number;
}

// ใช้ global object เพื่อให้แน่ใจว่าใช้ instance เดียวกัน
declare global {
  // eslint-disable-next-line no-var
  var __sessions: Map<string, SessionData> | undefined;
}

// ใช้ global object เพื่อให้แน่ใจว่าใช้ instance เดียวกันใน Next.js
const sessions = global.__sessions || new Map<string, SessionData>();

if (process.env.NODE_ENV !== 'production') {
  global.__sessions = sessions;
}

export function getSession(token: string): SessionData | undefined {
  const session = sessions.get(token);
  
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('getSession called with token:', token.substring(0, 20) + '...');
    console.log('Total sessions in memory:', sessions.size);
    console.log('Session found:', session ? 'YES' : 'NO');
    if (session) {
      console.log('Session expiry:', new Date(session.expiry).toISOString());
      console.log('Current time:', new Date().toISOString());
      console.log('Is expired:', session.expiry < Date.now());
    }
    // Log all session tokens
    console.log('All session tokens:', Array.from(sessions.keys()).map(k => k.substring(0, 20) + '...'));
  }
  
  return session;
}

export function setSession(token: string, expiry: number): void {
  sessions.set(token, { expiry });
  
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('setSession called with token:', token.substring(0, 20) + '...');
    console.log('Expiry:', new Date(expiry).toISOString());
    console.log('Total sessions in memory:', sessions.size);
  }
}

export function deleteSession(token: string): void {
  sessions.delete(token);
}

export function cleanupExpiredSessions(): void {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (session.expiry < now) {
      sessions.delete(token);
    }
  }
}

// Cleanup expired sessions every hour
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredSessions, 60 * 60 * 1000);
}

