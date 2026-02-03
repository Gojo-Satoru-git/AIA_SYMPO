import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOtpEmail = async (email, otp) => {
    try {
        const info = await resend.emails.send({
            from: "Tekhora <noreply@tekhora26.live>",
            to: email,
            subject: "Symposium '26 Email Verification",
            html: `
                <div style="font-family: Arial; padding: 20px;">
                    <h2>Symposium '26</h2>
                    <p>Your OTP is:</p>
                    <h1 style="color:#e50914">${otp}</h1>
                    <p>This OTP expires in ${process.env.OTP_EXPIRY_MINUTES} minutes.</p>
                </div>
            `,
        });
        return info;
    } catch (error) {
        console.error("Error sending an OTP", error);
        throw error;
    }
};

export {sendOtpEmail};