import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // Don't attach token to public endpoints
  if (
    token &&
    !config.url.includes("/users/login") &&
    !config.url.includes("/users/register")
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;