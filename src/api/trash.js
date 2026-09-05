import api from "./client";
export const getTrash = () => api.get("/trash");
export const restoreFile = (id) => api.patch(`/trash/files/${id}/restore`);
export const restoreFolder = (id) => api.patch(`/trash/folders/${id}/restore`);
