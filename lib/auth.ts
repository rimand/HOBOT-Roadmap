// Client-side authentication utilities

export async function verifySession(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/verify');
    const data = await response.json();
    return data.authenticated === true;
  } catch (error) {
    console.error('Session verification error:', error);
    return false;
  }
}

export async function login(password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true };
    } else {
      // Log error for debugging
      console.error('Login failed:', data.error);
      return { success: false, error: data.error || 'Authentication failed' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Network error - กรุณาตรวจสอบว่า server กำลังรันอยู่' };
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
    // Redirect to login page
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error);
  }
}

