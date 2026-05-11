import axios from "axios";

const progressApi = axios.create({
  baseURL: import.meta.env.VITE_PROGRESS_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

progressApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export type ProgressItem = {
  id: string;
  challenge_id: string;
  user_id: string;
  progress_date: string;
  description: string;
  created_at: string;
};

export const registerProgress = async (data: {
  challenge_id: string;
  progress_date?: string;
  description: string;
}) => {
  const res = await progressApi.post("/progress/", data);
  return res.data;
};

export const getMyProgressByChallenge = async (challengeId: string) => {
  const res = await progressApi.get(`/progress/challenge/${challengeId}/me`);
  return res.data as ProgressItem[];
};

export type ProgressSummary = {
  recent_progress: ProgressItem[];
  active_challenges: number;
  completed_challenges: number;
  message: string | null;
};

export const getProgressSummary = async () => {
  const res = await progressApi.get("/progress/me/summary");
  return res.data as ProgressSummary;
};