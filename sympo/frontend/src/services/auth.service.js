import api from "./api";

export const registerUser = async (payload, token) => {
  const response = await api.post(
    "/auth/signup",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};


// export const getProfile = async (token) => {
//   try {
//     const response = await api.get("/auth/profile");
//     return response.data;
//   } catch (error) {
//     if (error.response?.status === 401) {
//       throw new Error("Unauthorized access to profile");
//     }
//     throw error.response?.data || error;
//   }
// };

export const logoutUser = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Logout error:", error);
    return { success: true };
  }
};
