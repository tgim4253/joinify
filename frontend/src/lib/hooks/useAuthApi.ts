import { useApi } from "./useApi";

export function useAuthApi() {
    const api = useApi();

    return {
        login: async (body: object) => api.post<LoginedData>("/admin/auth/login", body),
    };
}