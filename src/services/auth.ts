import axios from "axios";

const AUTH_BASE_URL = import.meta.env.DEV ? "" : "https://theclippers.ge";

const ACCESS_TOKEN_KEY = "clippers_access_token";
const REFRESH_TOKEN_KEY = "clippers_refresh_token";

interface LoginResponse {
  access?: string;
  refresh?: string;
}

interface RefreshResponse {
  access?: string;
  refresh?: string;
}

const authClient = axios.create({
  baseURL: AUTH_BASE_URL,
  timeout: 12_000,
  withCredentials: true,
});

function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= nowInSeconds + 30;
}

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const hasStoredAuthTokens = (): boolean => {
  return Boolean(getAccessToken() || getRefreshToken());
};

export const clearAuthTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

function storeTokens(data: { access?: string; refresh?: string }): void {
  if (data.access) {
    localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
  }
  if (data.refresh) {
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);
  }
}

export const loginDashboard = async (
  username: string,
  password: string,
): Promise<void> => {
  const res = await authClient.post<LoginResponse>("/auth/login/", {
    username,
    password,
  });
  if (!res.data.access) {
    throw new Error("Missing access token in login response");
  }
  storeTokens(res.data);
};

export const refreshDashboardToken = async (): Promise<boolean> => {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  try {
    const res = await authClient.post<RefreshResponse>("/auth/token/refresh/", {
      refresh,
    });
    if (!res.data.access) return false;
    storeTokens(res.data);
    return true;
  } catch {
    clearAuthTokens();
    return false;
  }
};

export const ensureDashboardSession = async (): Promise<boolean> => {
  const access = getAccessToken();
  if (access && !isTokenExpired(access)) {
    return true;
  }
  return refreshDashboardToken();
};

export const logoutDashboard = async (): Promise<void> => {
  const refresh = getRefreshToken();

  try {
    await authClient.post("/auth/logout/", refresh ? { refresh } : {});
  } catch {
    // Ignore server-side logout errors and clear local state anyway.
  } finally {
    clearAuthTokens();
  }
};
