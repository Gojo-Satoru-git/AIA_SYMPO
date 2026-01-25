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
    console.error("Request setup failed: ", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if(error.response) {
      const {status, data} = error.response;

      switch (status) {
        case 400:
          console.error("Bad Request: ", data.message);
          break;
        case 401:
          console.error("Unauthorized - Token expired or invalid");
          break;
        case 403:
          console.error("Forebidden: ", data.message);
          break;
        case 404:
          console.error("Not Found:", data.message);
          break;
        case 429:
          console.error("Too Many Requests - Rate limited");
          break;
        case 500:
          console.error("Server Error:", data.message);
          break;
        default:
          console.error(`HTTP Error ${status}:`, data.message);
      }
    } 
    else if(error.message) {
      console.error("Network Error - No response received");
    }
    else {
      console.error("Error: ", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
