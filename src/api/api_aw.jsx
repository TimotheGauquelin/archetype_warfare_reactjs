import axios from "axios";

const api_aw = axios.create({
  // Pour Docker Compose, utilisez le nom du service backend
  baseURL: process.env.NODE_ENV === 'production' 
    ? "http://backend:8889/api"  // Nom du service backend dans Docker
    : "http://localhost:8889/api" // Pour le développement local
});

export default api_aw;
