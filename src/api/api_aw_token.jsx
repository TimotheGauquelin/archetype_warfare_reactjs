import axios from "axios";

export const api_aw_token = (token) => axios.create({
    baseURL: process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_BACKEND_URL
        : "http://localhost:8889/api",
    headers: {
        Authorization: `Bearer ${token}`
    }
});