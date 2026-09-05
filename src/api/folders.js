import api from "./client";

export const getFolder = (id) => api.get(`/folders/${id}`);
export const createFolder = (data) => api.post("/folders", data);
export const updateFolder = (id, data) => api.patch(`/folders/${id}`, data);
export const deleteFolder = (id) => api.delete(`/folders/${id}`);
