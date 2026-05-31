export const TOKEN_KEY = "cookmarket_access_token";
export const USER_KEY = "cookmarket_user";

export type UserRole = "CLIENT" | "SELLER" | "ADMIN";

export type AuthUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  profileImageUrl?: string | null;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return Boolean(getAccessToken() && getCurrentUser());
}

export function getUserRole(): UserRole | null {
  return getCurrentUser()?.role ?? null;
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return getSessionStorage().getItem(TOKEN_KEY) || window.localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = getSessionStorage().getItem(USER_KEY) || window.localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function saveSession(auth: AuthResponse): void {
  if (typeof window === "undefined") {
    return;
  }
  getSessionStorage().setItem(TOKEN_KEY, auth.accessToken);
  getSessionStorage().setItem(USER_KEY, JSON.stringify(auth.user));
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function updateCurrentUser(user: AuthUser): void {
  if (typeof window === "undefined") {
    return;
  }
  const storage = getSessionStorage().getItem(USER_KEY) ? getSessionStorage() : window.localStorage;
  storage.setItem(USER_KEY, JSON.stringify(user));
}

export function logout(): void {
  if (typeof window === "undefined") {
    return;
  }
  getSessionStorage().removeItem(TOKEN_KEY);
  getSessionStorage().removeItem(USER_KEY);
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function isSeller(): boolean {
  return getUserRole() === "SELLER";
}

function getSessionStorage(): Storage {
  return window.sessionStorage;
}
