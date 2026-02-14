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
    const { uid, email, email_verified } = req.user;
    console.log("Signup Request Body:", req.body);
    let { name, phone, institute, year } = req.body;

    const verifiedDoc = await db.collection("verifiedEmails").doc(email).get();
    const isCustomVerified = verifiedDoc.exists && verifiedDoc.data().verified;
    
    // if (!isCustomVerified && !email_verified) {
    //   return res.status(400).json({ message: "Email not verified. Please verify your email first." });
    // }

    // Sanitize inputs first
    name = sanitizeInput(name);
    phone = sanitizeInput(phone);
    institute = sanitizeInput(institute);

    // Validate after sanitization
    if (!name || !phone || !institute || !year) return error(res, "Missing fields", 400);
    if (!validatePhone(phone)) return error(res, "Invalid phone", 400);
    if (isNaN(year) || year < 1 || year > 4) return error(res, "Invalid year", 400);

    const userRef = db.collection("users").doc(uid);

    await db.runTransaction(async (t) => {
      const doc = await t.get(userRef);
      if(doc.exists){
        throw new Error("USER_EXISTS");
      }

      t.set(userRef, {
        uid,
        email: email ? email.toLowerCase() : "",
        name: name.substring(0, 100),
        phone: phone,
        institute: institute.substring(0, 150),
        year: parseInt(year),
        role: "PARTICIPANT",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      if(isCustomVerified) {
          t.delete(db.collection("verifiedEmails").doc(email));
      }
    });

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
    if (req.user?.uid) {
      await admin.auth().revokeRefreshTokens(req.user.uid);
    }
    return success(res, null, "Logged out");
  } catch (err) {
    return success(res, null, "Logged out (with session cleanup)");
  }
};


export const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const docSnap = await db.collection("verifiedEmails").doc(email).get();

    if (!docSnap.exists) {
      return error(res, "Email not Verified", 404);
    }

    const data = docSnap.data();

    return success(res, {
      msg: 'Email Verified',
      isVerified: data.verified || null
    });

  } catch (e) {
    return error(res, e.message, 500);
  }
};
