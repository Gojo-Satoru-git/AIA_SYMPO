import { db } from "../config/firebase.js";
import admin from "firebase-admin";
import { success, error } from "../utils/response.js";

const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().substring(0, 255);
};

export const signup = async (req, res) => {
  try {
    if (!req.user || !req.user.uid) {
      return error(res, "Unauthorized", 401);
    }

    const { uid, email } = req.user;
    const { name, phone, institute, year } = req.body;

    if ( !name || !phone || !institute || !year)
      return error(res, "Missing required fields", 400);

    if(!validatePhone(phone)){
      return error(res, "Invalid phone number", 400);
    }

    const yearNum = parseInt(year);
    if(isNaN(yearNum) || yearNum < 1 || yearNum > 4){
      return error(res, "Invalid uear", 400);
    }

    const sanitizedData = {
      name: sanitizeInput(name).substring(0, 100),
      phone: sanitizeInput(phone),
      institute: sanitizeInput(institute).substring(0, 150),
      year: yearNum,
    }

    const userRef = db.collection("users").doc(uid);

    await db.runTransaction(async (t) => {
      const doc = await t.get(userRef);
      if(doc.exists){
        throw new Error("USER_EXISTS");
      }

      t.set(userRef, {
        uid,
        email:email ? email.toLowerCase() : "",
        ...sanitizedData,
        role: "PARTICIPANT",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    console.log(`New user registered: ${uid}`);
    return success(res, { uid }, "User registered successfully", 201);

  } catch (err) {
      console.error("Signup error: ", err);
      if (err.message === "USER_EXISTS") {
        return error(res, "User already registered", 400);
      }
      return error(res, "Registration failed", 500);
  }
};

export const getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.uid) return error(res, "Unauthorized", 401);

    const userRef = db.collection("users").doc(req.user.uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = doc.data();

    return success(res, {
      uid: userData.uid,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      institute: userData.institute,
      year: userData.year,
      role: userData.role
    }, "Profile fetched successfully");
  } catch (err) {
    console.error("Profile error:", err);
    return error(res, "Failed to fetch profile", 500);
  }
};


export const logout = async (req, res) => {
  try {
    if (!req.user || !req.user.uid) return error(res, "Unauthorized", 401);

    const uid = req.user.uid;
    // Revoke all refresh tokens
    await admin.auth().revokeRefreshTokens(uid);

    return success(res, null, "Logged out successfully");

  } catch (err) {
      console.error(`Logout error: ${req.user?.uid}`, err);
      return error(res, "Logout failed", 500);
  }
};