import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000" });
export const getFeed = async () => (await api.get("/feed")).data.profiles;
export const sendSwipe = async (profileId, action) =>
  (await api.post("/swipe", { profileId, action })).data;
export const getMatches = async () => (await api.get("/matches")).data.matches;
