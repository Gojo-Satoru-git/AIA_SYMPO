import { db } from "../config/firebase.js";
import { success, error } from "../utils/response.js";

export const getProfile = async (req, res) => {
  try {
    const uid = req.user.uid;

    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists){
      return error(res, "User not found", 404);
    }

    const userData = userDoc.data();
    return success(res, userData);
  } catch (err) {
    console.error("Get profile error: ", err);
    return error(res, err.message);
  }
};
