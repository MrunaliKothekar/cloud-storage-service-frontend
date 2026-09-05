import api from "./client";
export const searchAll = (q) => api.get("/search", { params: { q } });
