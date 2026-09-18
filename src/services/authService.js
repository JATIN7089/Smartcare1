/**
 * SmarTCARE Authentication Service
 * ============================================================
 * Handles sign-in, session restore and sign-out for the three audiences:
 * the senior, their family caregiver, and the community health officer.
 *
 * The role now comes from the credentials the person signed in with, so a
 * senior simply cannot reach the caregiver or clinical portals — previously
 * anyone could flip a UI switch and land in the doctor's view.
 *
 * The token is kept in localStorage so a refresh (or a phone locking and
 * unlocking) does not throw the user back to the login screen.
 */

const TOKEN_KEY = 'smartcare_auth_token';

/** Offline fallback so the demo still works with no backend reachable. */
const OFFLINE_ACCOUNTS = [
  { id: 'user-asha-68', username: 'asha',   password: 'asha123',   pin: '1234', role: 'elderly',    name: 'Asha Sharma',    detail: 'Tezpur, Assam • 68 yrs',                    avatar: 'A' },
  { id: 'care-sunita',  username: 'sunita', password: 'care123',   pin: '2345', role: 'caregiver',  name: 'Sunita Sharma',  detail: 'Daughter • Primary Caregiver',              avatar: 'S' },
  { id: 'cho-barua',    username: 'barua',  password: 'doctor123', pin: '3456', role: 'healthcare', name: 'Dr. B. K. Barua', detail: 'Community Health Officer • Sonitpur SDH', avatar: 'B' }
];

function readToken() {
  try { return localStorage.getItem(TOKEN_KEY); } catch (e) { return null; }
}

function writeToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch (e) { /* private browsing — session just won't persist */ }
}

function publicAccount(acc) {
  if (!acc) return null;
  const { password, pin, ...safe } = acc;
  return safe;
}

export const authService = {
  getToken: readToken,

  /** Authorization header for protected API calls. */
  authHeaders() {
    const token = readToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  /** The three demo identities shown as quick-pick cards on the login screen. */
  async listAccounts() {
    try {
      const res = await fetch('/api/auth/accounts');
      if (res.ok) return await res.json();
    } catch (e) { /* fall through */ }
    return OFFLINE_ACCOUNTS.map(({ username, role, name, detail, avatar }) =>
      ({ username, role, name, detail, avatar }));
  },

  /**
   * Sign in with a password or a 4-digit PIN.
   * @returns {{success: boolean, account?: object, message?: string}}
   */
  async login({ username, password, pin }) {
    const id = String(username || '').trim().toLowerCase();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: id, password, pin })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        writeToken(data.token);
        return { success: true, account: data.account };
      }
      return { success: false, message: data.message || 'Sign in failed.' };
    } catch (e) {
      // Offline: verify against the bundled demo accounts.
      const acc = OFFLINE_ACCOUNTS.find(a => a.username === id);
      if (!acc) return { success: false, message: 'We could not find that account.' };

      const ok = (password && password === acc.password) || (pin && String(pin) === acc.pin);
      if (!ok) return { success: false, message: 'Incorrect password or PIN. Please try again.' };

      writeToken('offline-' + acc.id);
      return { success: true, account: publicAccount(acc), offline: true };
    }
  },

  /** Restores a session after a reload. Returns null when signed out. */
  async restore() {
    const token = readToken();
    if (!token) return null;

    // Offline tokens encode the account id directly.
    if (token.startsWith('offline-')) {
      const acc = OFFLINE_ACCOUNTS.find(a => a.id === token.replace('offline-', ''));
      return acc ? publicAccount(acc) : null;
    }

    try {
      const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        return data.account || null;
      }
      // Token no longer valid on the server.
      writeToken(null);
      return null;
    } catch (e) {
      return null;
    }
  },

  async logout() {
    const token = readToken();
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
    } catch (e) { /* signing out locally is what matters */ }
    writeToken(null);
  }
};

export default authService;
