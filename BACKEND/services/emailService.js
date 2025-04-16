
import nodemailer from "nodemailer";

export function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
}

export async function sendVerificationEmail(dest,code) {
    try {
       
        const transport = nodemailer.createTransport({
            host: "smtp.mailersend.net",
            port: 587, 
            secure: false,
            auth: {
                user: process.env.MAILERSEND_USERNAME, 
                pass: process.env.MAILERSEND_PASSWORD,
            },
        });

        const mailOptions = {
            from: `Syncora <MS_pdttEL@trial-2p0347z5v57lzdrn.mlsender.net>`,
            to : dest,
            subject: "Your Verification Code ajmi",
            html: `<p>Your verification code is: <strong>${code}</strong></p>`,
        };

        const result = await transport.sendMail(mailOptions);
        console.log("Email sent successfully:", result);
        return result;
    } catch (error) {
        console.error("Error sending email:", error);
        return error;
    }
}
