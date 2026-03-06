import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_IDENTITY_API,
  headers: {
    "Content-Type": "application/json",
  },
});

// interceptor para enviar el token automáticament
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
