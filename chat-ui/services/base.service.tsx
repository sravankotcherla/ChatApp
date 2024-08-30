import axios, { InternalAxiosRequestConfig } from "axios";
import { getAsyncStorageData } from "../helpers/common-helpers";

export const expressUrl = "http://localhost:8082/";

export const axiosNode = axios.create({
  baseURL: expressUrl,
});

axiosNode.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAsyncStorageData("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  }
);