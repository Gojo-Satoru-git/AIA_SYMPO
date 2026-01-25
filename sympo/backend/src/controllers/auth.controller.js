import { db } from "../config/firebase.js";
import admin from "firebase-admin";
import { success, error } from "../utils/response.js";

// Input validation helper
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

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
    const { name, phone, institute, year } = req.body;
    const uid = req.user.uid;
    const email = req.user.email;

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
    const doc = await userRef.get();

    if (doc.exists)
      return error(res, "User already registered", 400);

    await userRef.set({
      uid,
      email: email.toLowerCase(),
      ...sanitizedData,
      role: "PARTICIPANT",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`New user registered: ${uid}`);

    return success(res, { uid }, "User registered successfully", 201);
  } catch (err) {
    console.log("Signup error: ", err);
    return error(res, "Registration failed", 500);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.user.uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      uid: doc.data().uid,
      email: doc.data().email,
      role: doc.data().role,
    });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};


export const logout = async (req, res) => {
  try {
    const uid = req.user.uid;

    // Revoke all refresh tokens
    await admin.auth().revokeRefreshTokens(uid);

    console.log(`User logged out: ${uid}`);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.log(`Logout error: ${uid}`);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};