const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.hostinger.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true, // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendOTP = async (to, otp) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log("No SMTP credentials provided in .env, skipping real email delivery.");
      console.log(`[MOCK EMAIL to ${to}] Your OTP is: ${otp}`);
      return true;
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject: "Your Brainloom Account Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Welcome to Brainloom!</h2>
          <p>Please use the following single-use code to verify your email address. It will expire in exactly 10 minutes.</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <h1 style="letter-spacing: 5px; color: #333; margin: 0;">${otp}</h1>
          </div>
          <p>If you did not request this verification code, please ignore this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("OTP Email successfully sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending OTP email via Hostinger SMTP:", error);
    return false;
  }
};
