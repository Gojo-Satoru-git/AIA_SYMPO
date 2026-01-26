import { db } from "../config/firebase.js";
import { error } from "../utils/response.js";

export const requireRegisteredUser = async (req, res, next) => {
  try {
    if (!req.user || !req.user.uid) {
      return error(res, "Authentication required", 401);
    }

    const userDoc = await db.collection("users").doc(req.user.uid).get();

    if (!userDoc.exists) {
      return error(res, "Complete registration first", 403);
    }

    req.userProfile = userDoc.data();

    next();
  } catch (err) {
    console.error("RequireRegisteredUser Error:", err);
    return error(res, "Internal Server Error", 500);
  }
};