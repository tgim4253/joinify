import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../api"; // 기존 fetchWrapper 포함된 api

export function useApi() {
    const { logout } = useContext(AuthContext);

    return {
        get: <T>(url: string, headers?: HeadersInit, useToken = false) =>
            api.get<T>(url, headers, useToken, logout),

        post: <T>(url: string, body: object, headers?: HeadersInit, useToken = false) =>
            api.post<T>(url, body, headers, useToken, logout),

        put: <T>(url: string, body: object, headers?: HeadersInit, useToken = false) =>
            api.put<T>(url, body, headers, useToken, logout),

        delete: <T>(url: string, headers?: HeadersInit, useToken = false) =>
            api.delete<T>(url, headers, useToken, logout),
    };
}