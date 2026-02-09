import axios from "axios";

const api_aw = axios.create({
  baseURL: import.meta.env.MODE === 'production' 
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:8889/api" // Pour le développement local
});

export default api_aw;
