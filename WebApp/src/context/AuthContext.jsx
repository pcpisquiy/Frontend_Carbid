import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Cargar usuario guardado al montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem("auth:user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  // Persistir cambios
  useEffect(() => {
    if (user) localStorage.setItem("auth:user", JSON.stringify(user));
    else localStorage.removeItem("auth:user");
  }, [user]);

  // Simulación de login (sin backend):
  // Si no mandas name/username, derivamos un "displayName" del email
  const login = ({ email, name, username }) => {
    const displayName =
      (name && name.trim()) ||
      (username && username.trim()) ||
      (email ? email.split("@")[0] : "usuario");
    setUser({
      email,
      name: displayName,
      username: username || displayName,
    });
  };

  const logout = () => setUser(null);

  const value = useMemo(
    () => ({ user, login, logout, isAuthenticated: !!user }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
