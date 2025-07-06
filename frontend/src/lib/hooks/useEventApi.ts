import { useApi } from "./useApi";

export function useEventApi() {
  const api = useApi();

  return {
    /* public */
    getEvents: 
        ()                          => api.get<Event[]>("/public/event/list"),
    getEvent:  
        (id: string)                => api.get<Event>(`/public/event/${id}`),

    /* admin (token 필요) */
    getAdminEvents:     
        ()                          => api.get<Event[]>("/admin/event/list", {}, true),
    getAdminEvent:      
        (id: string)                => api.get<Event>(`/admin/event/${id}`, {}, true),
    updateAdminEvent: 
        (id: string, body: object)  => api.put<Event>(`/admin/event/${id}`, body, {}, true),

    uploadCsv: 
        (body: FormData) => 
            api.post<CSVUploadResponse>(`/admin/event/upload`, body, {}, true),
  };
}