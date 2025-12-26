import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { deleteSession } from '../../../lib/sessions';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sessionToken = req.cookies.hobot_session;

  if (sessionToken) {
    deleteSession(sessionToken);
  }

  // ลบ cookie
  const cookie = serialize('hobot_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
  return res.status(200).json({ success: true });
}

