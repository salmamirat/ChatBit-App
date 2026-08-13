import axios from "axios";

import { useAuthStore } from "../store/authStore";
export const API_URL = "http://192.168.1.245:3000";
const api = axios.create({
  baseURL: API_URL + "/api"
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;