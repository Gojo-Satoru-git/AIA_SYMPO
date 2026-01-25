import api from "./api";

export const registerUser = async (payload) => {
  try {
    const response = await api.post("/auth/signup", payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getProfile = async (token) => {
  try {
    const response = await api.get("/user/profile");
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Unauthorized access to profile");
    }
    throw error.response?.data || error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Logout error:", error);
    throw error.response?.data || error;
  }
};
