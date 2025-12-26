import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '../../../lib/sessions';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sessionToken = req.cookies.hobot_session;

  if (!sessionToken) {
    return res.status(401).json({ authenticated: false });
  }

  const session = getSession(sessionToken);

  if (!session) {
    return res.status(401).json({ authenticated: false });
  }

  // ตรวจสอบว่า session หมดอายุหรือไม่
  if (session.expiry < Date.now()) {
    return res.status(401).json({ authenticated: false });
  }

  return res.status(200).json({ authenticated: true });
}

