import { db } from "../config/firebase.js";
import admin from "firebase-admin";
import { success, error } from "../utils/response.js";

const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

const sanitizeInput = (input) => input ? String(input).trim() : "";

export const signup = async (req, res) => {
  try {
    const { uid, email } = req.user;
    const { name, phone, institute, year } = req.body;

    if (!name || !phone || !institute || !year) return error(res, "Missing fields", 400);
    if (!validatePhone(phone)) return error(res, "Invalid phone", 400);

    const userRef = db.collection("users").doc(uid);

    await db.runTransaction(async (t) => {
      const doc = await t.get(userRef);
      if(doc.exists){
        throw new Error("USER_EXISTS");
      }

      t.set(userRef, {
        uid,
        email:email ? email.toLowerCase() : "",
        name: sanitizeInput(name).substring(0, 100),
        phone: sanitizeInput(phone),
        institute: sanitizeInput(institute).substring(0, 150),
        year: parseInt(year),
        role: "PARTICIPANT",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    console.log(`New user registered: ${uid}`);
    return success(res, { uid }, "User registered successfully", 201);

  } catch (err) {
      if (err.message === "USER_EXISTS") {
        return error(res, "User already registered", 400);
      }
      console.error("Signup error: ", err);
      return error(res, "Registration failed", 500);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userDoc = await db.collection("users").doc(req.user.uid).get();
    if (!userDoc.exists) return error(res, "User not found", 404);
    
    return success(res, userDoc.data(), "Profile fetched");
  } catch (err) {
    console.error("Profile Error:", err);
    return error(res, "Failed to fetch profile");
  }
};

export const logout = async (req, res) => {
  try {
    await admin.auth().revokeRefreshTokens(req.user.uid);
    return success(res, null, "Logged out");
  } catch (err) {
    return error(res, "Logout failed");
  }
};