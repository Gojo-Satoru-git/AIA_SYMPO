import { db } from "../config/firebase.js";
import { success, error } from "../utils/response.js";

export const signup = async (req, res) => {
  try {
    const { uid, email, name, phone, institute, year } = req.body;

    if (!uid || !email || !name || !phone || !institute || !year)
      return error(res, "Missing required fields", 400);

    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (userSnap.exists)
      return error(res, "User already exists", 409);

    await userRef.set({
      uid,
      email,
      name: name || "",
      phone: phone || "",
      institute: institute || "",
      year: year || "",
      role: "PARTICIPANT",
      createdAt: new Date(),
    });

    return success(res, null, "User registered successfully");
  } catch (err) {
    return error(res, err.message);
  }
};

export const logout = async (req, res) => {
  try {
    const uid = req.user.uid;

    await auth.revokeRefreshTokens(uid);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
