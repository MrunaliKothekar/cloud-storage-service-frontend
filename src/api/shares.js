import api from "./client";
export const createShare = (data) => api.post("/shares", data);
export const getShares = (resourceType, resourceId) =>
  api.get("/shares", { params: { resourceType, resourceId } });
export const deleteShare = (id) => api.delete(`/shares/${id}`);
