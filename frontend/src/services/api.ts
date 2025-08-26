import axios from "axios";

const baseURL = (import.meta as ImportMeta).env?.VITE_API_BASE as
  | string
  | undefined;

if (!baseURL) {
  throw new Error(
    "VITE_API_BASE is not set. Create frontend/.env with VITE_API_BASE=http://localhost:3001 and restart Vite."
  );
}

export const api = axios.create({ baseURL });

// Guard against accidental calls to the dev server returning HTML
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
