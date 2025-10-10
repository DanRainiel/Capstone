import nodemailer from 'nodemailer';
import { db } from './db_config.js';
import { collection, setDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Generate OTP
export function generateOTP(length = 6) {
  return Math.floor(Math.random() * 10 ** length)
    .toString()
    .padStart(length, '0');
}

// Save OTP in Firestore
export async function saveOTP(userId, otp) {
  try {
    await setDoc(doc(db, "OTP", userId), {
      otp,
      createdAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes expiry
    });
  } catch (err) {
    console.error("Error saving OTP:", err);
  }
}

// Send OTP email
export async function sendOTPEmail(toEmail, otp) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"PetStop OTP" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}. It expires in 5 minutes.`
    });

    console.log("OTP sent to", toEmail);
    return true;
  } catch (err) {
    console.error("Failed to send OTP:", err);
    return false;
  }
}
