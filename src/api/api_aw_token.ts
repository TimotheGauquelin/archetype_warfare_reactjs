import axios, { AxiosInstance } from "axios";

export const api_aw_token = (token: string): AxiosInstance => axios.create({
    baseURL: import.meta.env.MODE === 'production'
        ? import.meta.env.VITE_BACKEND_URL
        : "http://localhost:8889/api",
    headers: {
        Authorization: `Bearer ${token}`
    }
});