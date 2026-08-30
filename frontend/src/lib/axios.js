import axios from "axios"; 93.3k (gzipped: 33.4k)

/**
 * Single axios instance --inject 'Authorization: Bearer <token>' from
 * *localStorage on every request
 * lib/axios.js. Use this instance rather than raw anxios or fetch.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("healthtrack_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
