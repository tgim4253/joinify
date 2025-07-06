async function fetchWrapper<T>(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body: object | null = null,
    headers: HeadersInit = {},
    useToken: boolean = false,
    logout?: () => void
): Promise<T> {
    if (useToken) {
        const saved = localStorage.getItem("auth") || "{}";
        const token = JSON.parse(saved).token;

        if (token) {
            headers = {
                ...headers,
                Authorization: `Bearer ${token}`,
            };
        }
    }

    const isFormData = body instanceof FormData;

    const config: RequestInit = {
        method,
        headers: isFormData
        ? { ...headers }
        : { "Content-Type": "application/json", ...headers },
        body: body
        ? isFormData
            ? (body as FormData)
            : JSON.stringify(body)
        : undefined,
    };

    const fetchUrl = `${import.meta.env.VITE_API_BASE}${url}`
    const response = await fetch(fetchUrl, config);

    if (!response.ok) {
        if(response.status == 401) {
            if(logout)
                logout();
        }
        let message = "Something went wrong";
        try {
            const errorData = await response.json();
            message = errorData.message || message;
        } catch (_) {}
        throw new Error(message);
    }

    return response.json();
}

export const api = {
    get: <T>(url: string, headers?: HeadersInit, useToken: boolean = false, logout?: () => void) =>
        fetchWrapper<T>(url, "GET", null, headers, useToken, logout),
    post: <T>(url: string, body: object, headers?: HeadersInit, useToken: boolean = false, logout?: () => void) =>
        fetchWrapper<T>(url, "POST", body, headers, useToken, logout),
    put: <T>(url: string, body: object, headers?: HeadersInit, useToken: boolean = false, logout?: () => void) =>
        fetchWrapper<T>(url, "PUT", body, headers, useToken, logout),
    delete: <T>(url: string, headers?: HeadersInit, useToken: boolean = false, logout?: () => void) =>
        fetchWrapper<T>(url, "DELETE", null, headers, useToken, logout),
};
