import admin, { db } from "../config/firebase.js";

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = await admin.auth().verifyIdToken(token);

    const userDoc = await db.collection("users").doc(decodedToken.uid).get();

    if(!userDoc.exists){
      return res.status(401).json({message: "User note registered"});
    }

    req.user = {
      ...decodedToken,
      role: userDoc.data().role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
