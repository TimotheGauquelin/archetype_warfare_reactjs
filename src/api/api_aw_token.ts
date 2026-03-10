import axios, { AxiosInstance } from "axios";
import { store } from "../redux/store";
import { clearUser } from "../redux/slice/userSlice";
import { URL_FRONT_HOME } from "../constant/urlsFront";

export const api_aw_token = (token: string): AxiosInstance => {
  const instance = axios.create({
    baseURL:
      import.meta.env.MODE === "production"
        ? import.meta.env.VITE_BACKEND_URL
        : import.meta.env.VITE_BACKEND_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status as number | undefined;

      if (status === 401 || status === 403) {
        try {
          store.dispatch(clearUser());
        } catch {
          // ignore
        }
        if (typeof window !== "undefined") {
          window.location.href = URL_FRONT_HOME;
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};
