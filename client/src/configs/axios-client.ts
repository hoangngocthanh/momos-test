import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const isDev = import.meta.env.DEV === true;

const API_ENDPOINT = isDev
  ? import.meta.env.VITE_API_ENDPOINT_DEV
  : import.meta.env.VITE_API_ENDPOINT_PROD;

const axiosClient = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 30000,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle 401 error
    }
    return Promise.reject(error);
  }
);

const requestHandler = async (params: AxiosRequestConfig) => {
  const onSuccess = (response: AxiosResponse) => {
    return response?.data;
  };

  const onError = (error: AxiosError) => {
    return Promise.reject(
      error.response?.data ?? {
        message: error.message ?? "Something went wrong",
      }
    );
  };

  return axiosClient(params).then(onSuccess).catch(onError);
};

export default requestHandler;
