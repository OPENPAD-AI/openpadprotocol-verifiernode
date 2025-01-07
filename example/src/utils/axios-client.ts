import axios from "axios";
import { getCurrentChainId } from "./utils";

export const axiosClient = axios.create({
    withCredentials: true,
    baseURL: 'https://api.openpad.io',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*'
    },
    timeout: 300000
  });
  
  axiosClient.interceptors.request.use(function (config) {
    if (config?.headers) {
      config.headers.network = getCurrentChainId();
    }
    return config;
  });