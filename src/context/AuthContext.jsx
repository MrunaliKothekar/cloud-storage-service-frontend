import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    try {
      const res = await authApi.me();
      setUser(res.data.user ?? res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadUser(); }, []);

  async function login(credentials) {
    const res = await authApi.login(credentials);
    setUser(res.data.user ?? res.data);
    return res;
  }

  async function register(data) {
    const res = await authApi.register(data);
    setUser(res.data.user ?? res.data);
    return res;
  }

  async function logout() {
    try { await authApi.logout(); } finally { setUser(null); }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, reload: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
