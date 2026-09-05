import api from "./client";
export const getStars = () => api.get("/stars");
export const star = (data) => api.post("/stars", data);
export const unstar = (data) => api.delete("/stars", { data });
