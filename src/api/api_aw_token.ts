import axios, { AxiosInstance } from "axios";

export const api_aw_token = (token: string): AxiosInstance => axios.create({
    baseURL: import.meta.env.MODE === 'production'
        ? import.meta.env.VITE_BACKEND_URL
        : import.meta.env.VITE_BACKEND_URL,
    headers: {
        Authorization: `Bearer ${token}`
    }
});