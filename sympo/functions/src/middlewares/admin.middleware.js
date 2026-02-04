import { db } from "../config/firebase.js";

export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userDoc = await db.collection("users").doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(403).json({ message: "Forbidden: User profile not found" });
    }

    const userData = userDoc.data();

    if (userData.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    req.userProfile = userData; 
    next();

  } catch (error) {
    console.error("Admin Middleware Error:", error);
    return res.status(500).json({ message: "Internal Server Error during admin check" });
  }
};