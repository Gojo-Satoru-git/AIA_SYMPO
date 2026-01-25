import axios from "axios";
import { auth } from "../firebase";

const API_TIMEOUT = 30000; // 30 Seconds
const MAX_RETRIES = 3;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      await auth.authStateReady();

      const user = auth.currentUser;
      if(user){
        const token = await user.getIdToken(true);
        config.headers.Authorization = `Bearer ${token}`;
      } 
      return config;
    }
    catch (error) {
      console.error("Token retrieval failed: ", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (config && !config.__isRetryRequest && (!error.response || error.response.status >= 500)) {
      config.__retryCount = config.__retryCount || 0;
      
      if (config.__retryCount < MAX_RETRIES) {
        config.__retryCount += 1;
        config.__isRetryRequest = true;
        console.log(`Retrying request... Attempt ${config.__retryCount}`);
        
        const delay = Math.pow(2, config.__retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return api(config);
      }
    }

    if (error.response) {
      const { status, data } = error.response;

      console.error(`API Error ${status}:`, data?.message || "Unknown error");
      
      if (status === 401) {
        window.location.href = "/login";
      }
    } else {
      console.error("Network Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
