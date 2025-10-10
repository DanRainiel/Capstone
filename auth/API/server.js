// server.js
import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// In-memory OTP storage (you can replace with Firestore if needed)
const otpStore = new Map();

// ---------------------------
// ✅ Configure Email Transport
// ---------------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER, // e.g., petstopvetclinictest@gmail.com
    pass: process.env.SMTP_PASS  // e.g., petstop123
  },
});

// ---------------------------
// ✅ POST /send-otp
// ---------------------------
app.post("/send-otp", async (req, res) => {
  const { email, userId } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // expires in 5 mins

    await transporter.sendMail({
      from: `"PetStop Veterinary Clinic" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your PetStop Verification Code",
      html: `
        <h2>Verification Code</h2>
        <p>Hello ${userId || "User"},</p>
        <p>Your OTP code is:</p>
        <h1>${otp}</h1>
        <p>This code will expire in 5 minutes.</p>
        <hr/>
        <p>🐾 PetStop Veterinary Clinic</p>
      `,
    });

    console.log(`✅ OTP sent to ${email}: ${otp}`);
    res.status(200).json({ success: true, message: "OTP sent successfully." });
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP." });
  }
});

// ---------------------------
// ✅ POST /verify-otp
// ---------------------------
app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." });
  }

  const stored = otpStore.get(email);
  if (!stored) {
    return res.status(400).json({ message: "No OTP found for this email." });
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ message: "OTP has expired." });
  }

  if (parseInt(otp) !== stored.otp) {
    return res.status(400).json({ message: "Invalid OTP." });
  }

  otpStore.delete(email); // ✅ OTP used successfully
  res.status(200).json({ success: true, message: "OTP verified successfully." });
});

// ---------------------------
// ✅ Server Startup
// ---------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
