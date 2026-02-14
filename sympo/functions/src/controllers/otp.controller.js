import { generateOtp, storeOtp, verifyStoredOtp, canResendOtp, isEmailRegistered, checkEmailVerified } from '../service/otp.service.js';
import { sendOtpEmail } from '../utils/mailer.js';
import { db } from "../config/firebase.js";
import admin from "firebase-admin";

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if(!email) return res.status(400).json({message: "Email required"});

        const registered = await isEmailRegistered(email);
        if (registered) {
            return res.status(400).json({ message: "Email is already registered. Please Sign In." });
        }

        const isVerified = await checkEmailVerified(email);
        if (isVerified) {
            return res.status(200).json({ message: "Email is already verified", isVerified: true });
        }
        
        const allowed = await canResendOtp(email);

        if(!allowed) return res.status(429).json({message: "Please wait before requesting another OTP"});
    
        const otp = generateOtp();

        await storeOtp(email, otp);
        try {
            await sendOtpEmail(email, otp);
            res.json({message: "OTP sent successfully"});
        } catch (emailError) {
            console.error("Email Service Failed:", emailError);
            return res.status(424).json({ 
                message: "Email service limit reached. Switching to backup verification." 
            });
        }
    } catch (error) {
        console.error("OTP Controller Error:", error);
        res.status(500).json({message: error.message || "Internal Server Error"});
    }
};

const verifyOtp = async (req, res) => {
    try {
        const {email, otp} = req.body;

        if(!email || !otp) return res.status(400).json({message: "Email and OTP required"});

        await verifyStoredOtp(email, otp);

        await db.collection("verifiedEmails").doc(email).set({
            email: email,
            verified: true,
            verifiedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({message: "Email verified successfully"});
    } catch (error) {
        const msg = error.message;
        if (msg === "OTP expired" || msg === "Invalid OTP" || msg === "OTP not found") {
            return res.status(400).json({ message: msg });
        }
        if (msg === "Too many attempts") {
            return res.status(429).json({ message: msg });
        }
        res.status(500).json({ message: "Verification failed" });
    }
}

export { sendOtp, verifyOtp };