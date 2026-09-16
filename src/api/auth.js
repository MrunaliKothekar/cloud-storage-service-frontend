import api from "./client";

export const register = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);
export const logout = () => api.post("/auth/logout");
export const me = () => api.get("/auth/me");
export const refresh = () => api.post("/auth/refresh");
export const googleLoginUrl = () =>
  `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/api/auth/google`;
