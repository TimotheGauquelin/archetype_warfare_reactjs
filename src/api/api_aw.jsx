import axios from "axios";

const api_aw = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? process.env.REACT_APP_BACKEND_URL
    : "http://localhost:8889/api" // Pour le développement local
});

export default api_aw;
