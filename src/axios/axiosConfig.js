import axios from "axios";

const instance = axios.create({
  baseURL: "https://discussion-forum-server.vercel.app/",
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
