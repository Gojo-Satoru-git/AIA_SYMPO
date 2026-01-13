import { db } from "../config/firebase.js";
import { success, error } from "../utils/response.js";

export const getProfile = async (req, res) => {
  try {
    const uid = req.user.uid;

    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists)
      return error(res, "User not found", 404);

    return success(res, userDoc.data());
  } catch (err) {
    return error(res, err.message);
  }
};
