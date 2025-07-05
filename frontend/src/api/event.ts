import { api } from "./index";

export const eventApi = {
    getEvents: async () => api.get<Event[]>("/public/event/list"),
    getEvent: async (id: string) => api.get<Event>(`/public/event/${id}`),
    getAdminEvents: async () => api.get<Event[]>("/admin/event/list", {}, true),
    getAdminEvent: async (id: string) => api.get<Event>(`/admin/event/${id}`, {}, true),
};
