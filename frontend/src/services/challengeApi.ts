import axios from "axios";

const challengeApi = axios.create({
  baseURL: import.meta.env.VITE_RETOS_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

challengeApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// crear reto
export const createReto = async (data: any) => {
  const res = await challengeApi.post("/retos/", data);
  return res.data;
};

// obtener todos los retos
export const getRetos = async () => {
  const res = await challengeApi.get("/retos/");
  return res.data;
};

// obtener reto por id
export const getRetoById = async (id: string) => {
  const res = await challengeApi.get(`/retos/${id}`);
  return res.data;
};

// actualizar reto
export const updateReto = async (id: string, data: any) => {
  const res = await challengeApi.patch(`/retos/${id}`, data);
  return res.data;
};

// eliminar reto
export const deleteReto = async (id: string) => {
  await challengeApi.delete(`/retos/${id}`);
};