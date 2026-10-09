/**
 * Google Authentication & PostgreSQL Sync Utility
 */

const STORAGE_KEY = 'sudarshan_google_user';

// Parse JWT ID token payload safely
export function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse JWT token', e);
    return null;
  }
}

// Get saved Google user from localStorage
export function getSavedGoogleUser() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

// Save Google user profile to localStorage
export function saveGoogleUser(user) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save Google user', e);
  }
}

// Clear Google user session
export function logoutGoogleUser() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to remove Google user', e);
  }
}

// Sync local user progress to PostgreSQL via Netlify Function
export async function syncUserProgressToDB(user, profile, studyHours, syllabusCompletion) {
  if (!user || (!user.googleId && !user.email)) return null;

  const payload = {
    googleId: user.googleId,
    email: user.email,
    avatarUrl: user.picture,
    userName: profile?.userName || user.name || user.email?.split('@')[0],
    companionName: profile?.companionName || 'COGNITIVE AI',
    courseTitle: profile?.courseTitle || 'Class 10th / 11th',
    level: profile?.level || 1,
    totalStudyHours: studyHours || 0,
    syllabusPercent: syllabusCompletion || 0,
  };

  try {
    const res = await fetch('/.netlify/functions/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      return data.operative;
    }
  } catch (err) {
    console.warn('Sync to database failed (Offline or Function error):', err);
  }
  return null;
}

// Fetch user profile from PostgreSQL DB on login
export async function fetchUserProgressFromDB(googleId, email) {
  if (!googleId && !email) return null;

  try {
    const url = `/.netlify/functions/leaderboard?google_id=${encodeURIComponent(googleId || '')}&email=${encodeURIComponent(email || '')}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      return data.operative || null;
    }
  } catch (err) {
    console.warn('Fetch user progress failed:', err);
  }
  return null;
}
