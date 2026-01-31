import { generateOtp, storeOtp, verifyStoredOtp, canResendOtp } from '../service/otp.service.js';
import { sendOtpEmail } from '../utils/mailer.js';

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if(!email) return res.status(400).json({message: "Email required"});

        const allowed = await canResendOtp(email);

        if(!allowed) return res.status(429).json({message: "Please wait before requesting another OTP"});
    
        const otp = generateOtp();

        await storeOtp(email, otp);
        await sendOtpEmail(email, otp);

        res.json({message: "OTP sent successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const verifyOtp = async (req, res) => {
    try {
        const {email, otp} = req.body;

        if(!email || !otp) return res.status(400).json({message: "Email and OTP required"});

        await verifyStoredOtp(email, otp);

        res.json({message: "Email verified successfully"});
    } catch (error) {
        const status = error.message.includes("expired") || error.message.includes("Invalid") ? 400 : 500;
        res.status(status).json({ message: error.message });
    }
}

export { sendOtp, verifyOtp };