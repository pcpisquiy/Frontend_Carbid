import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Cargar sesión guardada
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem("auth:user");
      const rawToken = localStorage.getItem("auth:token");
      if (rawUser) setUser(JSON.parse(rawUser));
      if (rawToken) setToken(rawToken);
    } catch {}
  }, []);

  // Persistir cambios
  useEffect(() => {
    if (user) localStorage.setItem("auth:user", JSON.stringify(user));
    else localStorage.removeItem("auth:user");
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem("auth:token", token);
    else localStorage.removeItem("auth:token");
  }, [token]);

  /**
   * Login contra API:
   * POST http://localhost:8083/api/login
   * body: { usuario, password }
   * resp: { token, user: { id, email, name } }
   */
  const login = async ({ usuario, password }) => {
    const res = await fetch(process.env.REACT_APP_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, password }),
    });

    if (!res.ok) {
      const msg = await safeError(res);
      throw new Error(msg || "Credenciales inválidas o error del servidor.");
    }

    const data = await res.json();
    // data: { token, user }
    setUser(data.user ?? null);
    setToken(data.token ?? null);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  // fetch con token automáticamente
  const authFetch = (url, options = {}) => {
    const headers = { ...(options.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;
    return fetch(url, { ...options, headers });
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      login,
      logout,
      authFetch,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}

// Helper para leer mensaje de error del backend si lo envía
async function safeError(res) {
  try {
    const t = await res.text();
    if (!t) return null;
    const json = JSON.parse(t);
    return json?.message || json?.error || t;
  } catch {
    return null;
  }
}
