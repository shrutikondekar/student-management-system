import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// INTERCEPTOR: attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("INTERCEPTOR TOKEN =", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;