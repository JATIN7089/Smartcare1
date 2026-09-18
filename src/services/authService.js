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
  // The senior has no password: memory loss must never lock them out.
  { id: 'user-asha-68', username: 'asha',   role: 'elderly',    name: 'Asha Sharma',     detail: 'Tezpur, Assam • 68 yrs',                  avatar: 'A' },
  { id: 'care-sunita',  username: 'sunita', password: 'care123',   role: 'caregiver',  name: 'Sunita Sharma',   detail: 'Daughter • Primary Caregiver',            avatar: 'S' },
  { id: 'cho-barua',    username: 'barua',  password: 'doctor123', role: 'healthcare', name: 'Dr. B. K. Barua', detail: 'Community Health Officer • Sonitpur SDH', avatar: 'B' }
];

/** Accounts registered offline, kept so the person can sign in again later. */
const LOCAL_ACCOUNTS_KEY = 'smartcare_local_accounts';

function readLocalAccounts() {
  try { return JSON.parse(localStorage.getItem(LOCAL_ACCOUNTS_KEY) || '[]'); }
  catch (e) { return []; }
}

function writeLocalAccounts(list) {
  try { localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(list)); }
  catch (e) { /* private browsing */ }
}

function allOfflineAccounts() {
  return [...OFFLINE_ACCOUNTS, ...readLocalAccounts()];
}

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
    return allOfflineAccounts().map(({ username, role, name, detail, avatar }) =>
      ({ username, role, name, detail, avatar, requiresPassword: role !== 'elderly' }));
  },

  /**
   * Opens the senior's own home screen with no credentials at all.
   *
   * Requiring a password from someone living with dementia would lock them
   * out of their reminders and routine — the opposite of the point. Their
   * device is the key, and this door only ever opens the elderly experience.
   */
  async enter(username = 'asha') {
    try {
      const res = await fetch('/api/auth/enter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        writeToken(data.token);
        return { success: true, account: data.account };
      }
      return { success: false, message: data.message || 'Could not open your home screen.' };
    } catch (e) {
      const acc = allOfflineAccounts().find(a => a.username === username && a.role === 'elderly');
      if (!acc) return { success: false, message: 'No resident profile found on this device.' };
      writeToken('offline-' + acc.id);
      return { success: true, account: publicAccount(acc), offline: true };
    }
  },

  /**
   * Staff sign-in with a password. Caregivers and health workers only —
   * they are the ones handling other people's health data.
   */
  async login({ username, password }) {
    const id = String(username || '').trim().toLowerCase();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: id, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        writeToken(data.token);
        return { success: true, account: data.account };
      }
      return { success: false, message: data.message || 'Sign in failed.' };
    } catch (e) {
      const acc = allOfflineAccounts().find(a => a.username === id && a.role !== 'elderly');
      if (!acc) return { success: false, message: 'We could not find that account.' };
      if (!password || password !== acc.password) {
        return { success: false, message: 'Incorrect password. Please try again.' };
      }
      writeToken('offline-' + acc.id);
      return { success: true, account: publicAccount(acc), offline: true };
    }
  },

  /** Registers a new caregiver or health worker. Seniors never register. */
  async register(details) {
    const id = String(details.username || '').trim().toLowerCase();

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...details, username: id })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        writeToken(data.token);
        return { success: true, account: data.account };
      }
      return { success: false, message: data.message || 'Could not create your account.' };
    } catch (e) {
      // Offline registration, stored on this device.
      const name = String(details.name || '').trim();
      if (!name || !id || !details.password) {
        return { success: false, message: 'Please fill in your name, username and password.' };
      }
      if (String(details.password).length < 6) {
        return { success: false, message: 'Password must be at least 6 characters.' };
      }
      if (allOfflineAccounts().some(a => a.username === id)) {
        return { success: false, message: 'That username is already taken.' };
      }
      if (details.role === 'caregiver' && !details.joinCode) {
        return { success: false, message: "Enter the join code from the senior's profile." };
      }

      const acc = {
        id: `${details.role}-${id}`,
        username: id,
        password: String(details.password),
        role: details.role,
        name,
        detail: String(details.detail || '').trim() ||
          (details.role === 'caregiver' ? 'Family Caregiver' : 'Community Health Officer'),
        avatar: name[0].toUpperCase()
      };
      writeLocalAccounts([...readLocalAccounts(), acc]);
      writeToken('offline-' + acc.id);
      return { success: true, account: publicAccount(acc), offline: true };
    }
  },

  /** Restores a session after a reload. Returns default resident when signed out. */
  async restore() {
    const token = readToken();
    if (!token) {
      const resident = allOfflineAccounts().find(a => a.role === 'elderly') || OFFLINE_ACCOUNTS[0];
      writeToken('offline-' + resident.id);
      return publicAccount(resident);
    }

    // Offline tokens encode the account id directly.
    if (token.startsWith('offline-')) {
      const acc = allOfflineAccounts().find(a => a.id === token.replace('offline-', ''));
      return acc ? publicAccount(acc) : publicAccount(OFFLINE_ACCOUNTS[0]);
    }

    try {
      const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        if (data.account) return data.account;
      }
    } catch (e) {
      /* fall through to offline recovery */
    }

    const matched = allOfflineAccounts().find(a => token.includes(a.id));
    if (matched) return publicAccount(matched);

    const resident = allOfflineAccounts().find(a => a.role === 'elderly') || OFFLINE_ACCOUNTS[0];
    return publicAccount(resident);
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
