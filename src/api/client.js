import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    if (
      status !== 401 ||
      !original ||
      original._retry ||
      original.url?.includes("/auth/refresh") ||
      original.url?.includes("/auth/login") ||
      original.url?.includes("/auth/register")
    ) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      refreshPromise ??= api.post("/auth/refresh").finally(() => {
        refreshPromise = null;
      });
      await refreshPromise;
      return api(original);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export default api;
