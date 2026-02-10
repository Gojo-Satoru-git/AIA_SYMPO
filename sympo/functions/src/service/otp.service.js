import crypto from "crypto";
import admin from "firebase-admin";

const db = admin.firestore();

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
const hashOtp = (otp) => crypto.createHash("sha256").update(otp).digest("hex");

const isEmailRegistered = async (email) => {
  try {
    await admin.auth().getUserByEmail(email);
    return true;
  } catch (error) {
    if (error.code === "auth/user-not-found") return false;
    throw error;
  }
};

const checkEmailVerified = async (email) => {
  const doc = await db.collection("verifiedEmails").doc(email).get();
  return doc.exists;
};

const storeOtp = async (email, otp) => {
  const otpHash = hashOtp(otp);
  const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || "5");

  const expiresAt = admin.firestore.Timestamp.fromMillis(Date.now() + expiryMinutes * 60 * 1000);
  await db.collection("emailVerifications").doc(email).set({
    otpHash,
    expiresAt,
    attempts: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
};

const verifyStoredOtp = async (email, otp) => {
  const docRef = db.collection("emailVerifications").doc(email);
  const doc = await docRef.get();
  if (!doc.exists) throw new Error("OTP not found");

  const data = doc.data();
  if (Date.now() > data.expiresAt.toMillis()) throw new Error("OTP expired");
  if (data.attempts >= 5) throw new Error("Too many attempts");

  const inputHash = hashOtp(otp);
  if (inputHash !== data.otpHash) {
    await docRef.update({ attempts: data.attempts + 1 });
    throw new Error("Invalid OTP");
  }

  await docRef.delete();
  await db.collection("verifiedEmails").doc(email).set({
    verified: true,
    verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
};

const canResendOtp = async (email) => {
  const doc = await db.collection("emailVerifications").doc(email).get();
  if (!doc.exists) return true;

  const cooldown = parseInt(process.env.OTP_RESEND_COOLDOWN_SECONDS || "60");
  const data = doc.data();
  if (!data.createdAt) return false;
  return Date.now() - data.createdAt.toMillis() > cooldown * 1000;
};

export { generateOtp, storeOtp, verifyStoredOtp, canResendOtp, isEmailRegistered, checkEmailVerified };
