import axios from "axios";

export const api = axios.create({ baseURL: "/api" });

// Admin requests attach the JWT stored after /auth/login.
export const adminApi = axios.create({ baseURL: "/api" });
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("itb_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
