import api from "./client";

export const createShare = (data) => api.post("/shares", data);
export const getShares = (resourceType, resourceId) =>
  api.get("/shares", { params: { resourceType, resourceId } });
export const getSharedWithMe = () => api.get("/shares/shared-with-me");
export const getSharedByMe = () => api.get("/shares/shared-by-me");
export const deleteShare = (id) => api.delete(`/shares/${id}`);
