import api from "./client";
export const getActivities = () => api.get("/activities");
