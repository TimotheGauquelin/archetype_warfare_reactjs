import axios from "axios";
import { store } from "../redux/store";
import { clearUser } from "../redux/slice/userSlice";
import { clearSessionToken } from "@/utils/auth/sessionToken";
import { URL_FRONT_HOME } from "@/constant/urlsFront";

const api_aw = axios.create({
  baseURL:
    import.meta.env.MODE === "production"
      ? import.meta.env.VITE_BACKEND_URL
      : import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

/** Bearer optionnel (legacy) + cookie httpOnly via withCredentials. */
api_aw.interceptors.request.use((config) => {
  const token = store.getState().user?.token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api_aw.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status as number | undefined;
    const url = String(error?.config?.url ?? "");
    const isAuthBootstrap =
      url.includes("/authenticate/me") || url.includes("/authenticate/login");

    if ((status === 401 || status === 403) && !isAuthBootstrap) {
      try {
        clearSessionToken();
        store.dispatch(clearUser());
      } catch {
        // ignore
      }
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        // Ne force pas la redirection sur toutes les 403 (ex. permissions)
        if (status === 401) {
          window.location.href = URL_FRONT_HOME;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api_aw;
