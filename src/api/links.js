import api from "./client";
export const createLink = (data) => api.post("/links", data);
export const getLinks = (resourceType, resourceId) =>
  api.get("/links", { params: { resourceType, resourceId } });
export const deleteLink = (id) => api.delete(`/links/${id}`);
export const accessPublicLink = (token, password) =>
  api.get(`/links/public/${token}`, { params: password ? { password } : {} });
