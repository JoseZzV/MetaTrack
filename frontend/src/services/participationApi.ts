import axios from "axios";

const participationApi = axios.create({
  baseURL: import.meta.env.VITE_PARTICIPATION_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

participationApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Unirse a un reto
export const joinReto = async (challengeId: string) => {
  const res = await participationApi.post("/participations/", {
    challenge_id: challengeId,
  });

  return res.data;
};

//Obtener mis participaciones
export const getMyParticipations = async () => {
  const res = await participationApi.get("/participations/me");
  return res.data;
};

//Abandonar reto 
export const abandonReto = async (challengeId: string) => {
  const res = await participationApi.patch(
    `/participations/${challengeId}/abandon`
  );
  return res.data;
};

// Completar reto
export const completeReto = async (challengeId: string) => {
  const res = await participationApi.patch(
    `/participations/${challengeId}/complete`
  );

  return res.data;
};

// Obtener recompensas del usuario
export const getMyRewards = async () => {
  const res = await participationApi.get(
    "/participations/me/rewards"
  );

  return res.data;
};