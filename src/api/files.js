import api from "./client";

export const getFiles = (folderId = null) =>
  api.get("/files", { params: folderId ? { folderId } : {} });

export const initUpload = (data) => api.post("/files/init", data);
export const getUploadUrl = (data) => api.post("/files/upload-url", data);
export const completeUpload = (data) => api.post("/files/complete", data);

export const updateFile = (id, data) => api.patch(`/files/${id}`, data);
export const deleteFile = (id) => api.delete(`/files/${id}`);
export const downloadFile = (id) => api.get(`/files/${id}/download`);
