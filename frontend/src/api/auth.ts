import { api } from "./index";

export const authApi = {
    login: async (body: object) => api.post<LoginedData>("/admin/auth/login", body),
};