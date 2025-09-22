import axios from "axios";

const api_aw = axios.create({
  baseURL: "http://localhost:8889",
});

export default api_aw;
