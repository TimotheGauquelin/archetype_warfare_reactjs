import axios from "axios";

const api_aw = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

export default api_aw;
