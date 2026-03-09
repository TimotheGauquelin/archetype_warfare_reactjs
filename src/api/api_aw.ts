import axios from "axios";

const api_aw = axios.create({
  baseURL: import.meta.env.MODE === 'production' 
    ? import.meta.env.VITE_BACKEND_URL
    : import.meta.env.VITE_BACKEND_URL,
});

export default api_aw;
