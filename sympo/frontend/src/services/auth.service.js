import api from "./api";

export const registerUser = async (userData, token) => {
  const response = await api.post("/auth/signup", userData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const logoutUser = async () => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Logout API error", error);
  }
};