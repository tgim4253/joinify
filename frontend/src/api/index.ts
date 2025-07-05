async function fetchWrapper<T>(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body: object | null = null,
    headers: HeadersInit = {},
    useToken: boolean = false
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


    const config: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const fetchUrl = `${import.meta.env.VITE_API_BASE}${url}`
    const response = await fetch(fetchUrl, config);

    if (!response.ok) {
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
    get: <T>(url: string, headers?: HeadersInit, useToken: boolean = false) =>
        fetchWrapper<T>(url, "GET", null, headers, useToken),
    post: <T>(url: string, body: object, headers?: HeadersInit, useToken: boolean = false) =>
        fetchWrapper<T>(url, "POST", body, headers, useToken),
    put: <T>(url: string, body: object, headers?: HeadersInit, useToken: boolean = false) =>
        fetchWrapper<T>(url, "PUT", body, headers, useToken),
    delete: <T>(url: string, headers?: HeadersInit, useToken: boolean = false) =>
        fetchWrapper<T>(url, "DELETE", null, headers, useToken),
};
