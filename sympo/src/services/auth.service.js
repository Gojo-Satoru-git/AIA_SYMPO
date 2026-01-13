import axios from "axios";

const API = "http://localhost:5000/api";

export const registerUser = (payload) =>
  axios.post(`${API}/auth/signup`, payload);

export const getProfile = (token) =>
  axios.get(`${API}/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

export const logoutUser = (token) =>
  axios.post(
    `${API}/auth/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );