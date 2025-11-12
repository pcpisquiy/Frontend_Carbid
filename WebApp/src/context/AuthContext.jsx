import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

// ✅ SOLO REACT_APP_API_URL
const rawBase = process.env.REACT_APP_API_URL;
if (!rawBase) { throw new Error("REACT_APP_API_URL no está definida. Configúrala en .env"); }
const API = String(rawBase).replace(/\/+$/, "");

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem("auth:user");
      const rawToken = localStorage.getItem("token");
      if (rawUser) setUser(JSON.parse(rawUser));
      if (rawToken) setToken(rawToken);
    } catch {}
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("auth:user", JSON.stringify(user));
    else localStorage.removeItem("auth:user");
  }, [user]);
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  const isAuthFree = (url) => {
    try {
      const abs = url.startsWith("http") ? url : `${API}${url.startsWith("/") ? "" : "/"}${url}`;
      const u = new URL(abs);
      const p = u.pathname || "";
      return p.endsWith("/api/login") || p.endsWith("/api/register");
    } catch { return false; }
  };

  // fetch con token por defecto (excepto login/registro)
  const authFetch = (url, options = {}) => {
    const abs = url.startsWith("http") ? url : `${API}${url.startsWith("/") ? "" : "/"}${url}`;
    const headers = { ...(options.headers || {}) };
    if (token && !isAuthFree(abs)) headers.Authorization = `Bearer ${token}`;
    return fetch(abs, { ...options, headers });
  };

  const login = async ({ usuario, password, email }) => {
    const res = await fetch(`${API}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(email ? { email, password } : { usuario, password }),
    });
    if (!res.ok) throw new Error((await res.text()) || "Credenciales inválidas");
    const data = await res.json();
    setUser(data.user ?? null);
    setToken(data.token ?? null);
    return data.user;
  };

  const register = async ({ username, email, password, name }) => {
    const res = await fetch(`${API}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, name }),
    });
    if (!res.ok) throw new Error((await res.text()) || "No se pudo registrar");
    return res.json();
  };

  const logout = () => { setUser(null); setToken(null); };

  useEffect(() => {
    window.__API_BASE__ = API;
    window.__AUTH_FETCH__ = authFetch;
  }, [API, token]);

  const value = useMemo(() => ({
    user, token, isAuthenticated: !!token,
    login, register, logout, authFetch, API
  }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
