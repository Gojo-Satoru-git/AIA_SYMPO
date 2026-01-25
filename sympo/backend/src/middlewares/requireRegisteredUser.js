import { db } from "../config/firebase.js";

export const requireRegisteredUser = async (req, res, next) => {
  const userDoc = await db.collection("users").doc(req.user.uid).get();

  if (!userDoc.exists) {
    return res.status(403).json({ message: "Complete registration first" });
  }

  next();
};
