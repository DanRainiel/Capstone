// server.js - FIXED VERSION (No OTP for appointments)
import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// In-memory OTP storage with rate limiting
const otpStore = new Map();
const rateLimit = new Map();
const loginAttempts = new Map();

// ---------------------------
// ✅ Configure Email Transport
// ---------------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
});

// Rate limiting middleware
const checkRateLimit = (email) => {
  const now = Date.now();
  const userLimit = rateLimit.get(email);
  
  if (userLimit) {
    const timeDiff = now - userLimit.lastAttempt;
    if (timeDiff < 60000) { // 1 minute cooldown
      return false;
    }
  }
  
  rateLimit.set(email, { lastAttempt: now });
  return true;
};

// ---------------------------
// ✅ DEBUG MIDDLEWARE
// ---------------------------
app.use((req, res, next) => {
  if (req.path === '/send-otp' || req.path === '/send-appointment-confirmation') {
    console.log('🔍 DEBUG - Incoming Request:');
    console.log('  Path:', req.path);
    console.log('  Method:', req.method);
    console.log('  Body:', JSON.stringify(req.body, null, 2));
    console.log('---');
  }
  next();
});

// ---------------------------
// ✅ FIXED /send-otp ENDPOINT - NO OTP FOR APPOINTMENTS
// ---------------------------
app.post("/send-otp", async (req, res) => {
  const { email, userId, purpose = "login" } = req.body;

  console.log(`🎯 PROCESSING: Email to ${email}, Purpose: ${purpose}, User: ${userId}`);

  if (!email) {
    return res.status(400).json({ 
      success: false, 
      message: "Email is required" 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: "Invalid email format" 
    });
  }

  try {
    let subject, html, responseMessage;

    // ============================================
    // 🆕 APPOINTMENT ACCEPTANCE NOTIFICATION (NO OTP)
    // ============================================
    if (purpose === "appointment_accepted") {
      console.log(`📅 SENDING APPOINTMENT CONFIRMATION to ${email}`);
      console.log(`🚫 SKIPPING OTP: Purpose is appointment_accepted`);
      
      subject = "PetStop - Appointment Confirmed ✅";
      responseMessage = "Appointment confirmation email sent successfully.";
      
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <!-- Header with Logo -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f8732b; margin: 0;">🐾 PetStop Veterinary Clinic</h1>
            <p style="color: #666; margin: 5px 0;">Quality Care for Your Beloved Pets</p>
          </div>

          <!-- Success Banner -->
          <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); 
                      padding: 20px; 
                      border-radius: 10px; 
                      text-align: center; 
                      margin-bottom: 25px;">
            <h2 style="color: white; margin: 0; font-size: 24px;">
              🎉 Your Appointment is Confirmed!
            </h2>
          </div>

          <!-- Greeting -->
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Hello <strong>${userId || "Valued Customer"}</strong>,
          </p>

          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Great news! Your appointment at <strong>PetStop Veterinary Clinic</strong> has been successfully confirmed by our veterinary team.
          </p>

          <!-- Appointment Details Box -->
          <div style="background-color: #f0f8f0; 
                      padding: 25px; 
                      border-radius: 10px; 
                      margin: 25px 0;
                      border-left: 5px solid #4CAF50;">
            <h3 style="color: #f8732b; margin-top: 0; font-size: 18px;">
              📋 Appointment Status
            </h3>
            <div style="background: white; 
                        padding: 15px; 
                        border-radius: 5px;
                        display: inline-block;
                        margin: 10px 0;">
              <span style="font-size: 20px; font-weight: bold; color: #4CAF50;">
                ✓ CONFIRMED
              </span>
            </div>
            <p style="margin: 10px 0; color: #555;">
              <strong>📍 Location:</strong> PetStop Veterinary Clinic<br/>
              <strong>⏰ Reminder:</strong> Please arrive 10 minutes early for check-in.
            </p>
          </div>

          <!-- Important Reminders Box -->
          <div style="background-color: #fff3cd; 
                      padding: 20px; 
                      border-radius: 8px; 
                      margin: 25px 0;
                      border-left: 5px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0; font-size: 16px;">
              ⚠️ Important Reminders
            </h3>
            <ul style="margin: 10px 0; padding-left: 20px; color: #555; line-height: 1.8;">
              <li>Bring your pet's <strong>vaccination records</strong> (if applicable)</li>
              <li>Ensure your pet is on a <strong>leash or in a carrier</strong></li>
              <li>Bring <strong>payment</strong> for the consultation fee</li>
              <li>If your pet has any recent health issues, please inform our staff</li>
            </ul>
          </div>

          <!-- Need to Change? -->
          <div style="background-color: #e3f2fd; 
                      padding: 15px; 
                      border-radius: 8px; 
                      margin: 25px 0;
                      text-align: center;">
            <p style="margin: 0; color: #0277bd; font-size: 14px;">
              <strong>Need to reschedule?</strong><br/>
              Please contact us as soon as possible at your earliest convenience.
            </p>
          </div>

          <!-- Footer -->
          <hr style="border: none; border-top: 2px solid #e0e0e0; margin: 30px 0;"/>
          
          <div style="text-align: center; color: #666; font-size: 14px; line-height: 1.8;">
            <p style="margin: 5px 0;"><strong>🐾 PetStop Veterinary Clinic</strong></p>
            <p style="margin: 5px 0;">📞 Contact: +63 XXX XXX XXXX</p>
            <p style="margin: 5px 0;">📧 Email: ${process.env.SMTP_USER}</p>
            <p style="margin: 5px 0;">🌐 Website: www.petstop.com</p>
            <p style="margin: 15px 0 5px 0; font-size: 12px; color: #999;">
              We look forward to seeing you and your furry friend! 🐶🐱
            </p>
          </div>
        </div>
      `;

      console.log(`✅ APPOINTMENT EMAIL: Template prepared for ${email} - NO OTP INVOLVED`);

    } 
    
    // ============================================
    // PURPOSES THAT NEED OTP (login, registration, password_reset)
    // ============================================
    else if (purpose === "login" || purpose === "registration" || purpose === "password_reset") {
      console.log(`🔐 SENDING OTP for ${purpose} to ${email}`);
      
      // Check rate limiting for OTP purposes
      if (!checkRateLimit(email)) {
        return res.status(429).json({ 
          success: false, 
          message: "Please wait a minute before requesting another code" 
        });
      }

      const otp = Math.floor(100000 + Math.random() * 900000);
      otpStore.set(email, { 
        otp, 
        expiresAt: Date.now() + 5 * 60 * 1000,
        purpose: purpose,
        userId: userId 
      });

      responseMessage = "Verification code sent successfully.";

      switch (purpose) {
        case "registration":
          subject = "Welcome to PetStop - Verify Your Email";
          html = `
            <h2>Welcome to PetStop Veterinary Clinic!</h2>
            <p>Hello ${userId || "New User"},</p>
            <p>Thank you for registering with PetStop Veterinary Clinic. Your verification code is:</p>
            <h1 style="font-size: 32px; color: #f8732b; text-align: center;">${otp}</h1>
            <p>This code will expire in 5 minutes.</p>
            <p>If you didn't create an account, please ignore this email.</p>
            <hr/>
            <p>🐾 PetStop Veterinary Clinic</p>
          `;
          break;

        case "password_reset":
          subject = "PetStop - Password Reset Verification";
          html = `
            <h2>Password Reset Request</h2>
            <p>Hello ${userId || "User"},</p>
            <p>We received a request to reset your password. Your verification code is:</p>
            <h1 style="font-size: 32px; color: #f8732b; text-align: center;">${otp}</h1>
            <p>This code will expire in 5 minutes.</p>
            <p>If you didn't request a password reset, please contact us immediately.</p>
            <hr/>
            <p>🐾 PetStop Veterinary Clinic</p>
          `;
          break;

        case "login":
        default:
          subject = "PetStop - Login Verification Code";
          html = `
            <h2>Login Verification</h2>
            <p>Hello ${userId || "User"},</p>
            <p>Your login verification code is:</p>
            <h1 style="font-size: 32px; color: #f8732b; text-align: center;">${otp}</h1>
            <p>This code will expire in 5 minutes.</p>
            <p>If you didn't attempt to login, please secure your account immediately.</p>
            <hr/>
            <p>🐾 PetStop Veterinary Clinic</p>
          `;
      }

      console.log(`✅ OTP GENERATED: ${otp} for ${email} (${purpose})`);
    } else {
      // Invalid purpose
      return res.status(400).json({
        success: false,
        message: "Invalid purpose. Use 'appointment_accepted', 'login', 'registration', or 'password_reset'"
      });
    }

    // ============================================
    // SEND EMAIL
    // ============================================
    console.log(`📤 SENDING EMAIL to: ${email}`);
    console.log(`📧 SUBJECT: ${subject}`);
    console.log(`📝 EMAIL TYPE: ${purpose === "appointment_accepted" ? "APPOINTMENT CONFIRMATION" : "OTP VERIFICATION"}`);
    
    await transporter.sendMail({
      from: `"PetStop Veterinary Clinic" <${process.env.SMTP_USER}>`,
      to: email,
      subject: subject,
      html: html,
    });

    console.log(`✅ SUCCESS: ${responseMessage}`);

    res.status(200).json({ 
      success: true, 
      message: responseMessage,
      emailType: purpose === "appointment_accepted" ? "appointment_confirmation" : "otp_verification"
    });

  } catch (error) {
    console.error("❌ ERROR sending email:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send email. Please try again." 
    });
  }
});

// ---------------------------
// ✅ POST /verify-otp (ONLY FOR OTP PURPOSES)
// ---------------------------
app.post("/verify-otp", async (req, res) => {
  const { email, otp, purpose = "login" } = req.body;

  console.log(`🔐 VERIFY OTP: Email: ${email}, Purpose: ${purpose}`);

  if (!email || !otp) {
    return res.status(400).json({ 
      success: false, 
      message: "Email and verification code are required." 
    });
  }

  // Check if this is an OTP purpose (not appointment)
  if (purpose === "appointment_accepted") {
    return res.status(400).json({
      success: false,
      message: "Appointment confirmations do not require OTP verification."
    });
  }

  const stored = otpStore.get(email);
  
  if (!stored) {
    console.log(`❌ No OTP found for email: ${email}`);
    return res.status(400).json({ 
      success: false, 
      message: "No verification code found for this email. Please request a new one." 
    });
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    console.log(`❌ OTP expired for email: ${email}`);
    return res.status(400).json({ 
      success: false, 
      message: "Verification code has expired. Please request a new one." 
    });
  }

  if (stored.purpose !== purpose) {
    console.log(`❌ Purpose mismatch: ${stored.purpose} vs ${purpose}`);
    return res.status(400).json({ 
      success: false, 
      message: "Invalid verification code for this operation." 
    });
  }

  if (parseInt(otp) !== stored.otp) {
    const failedAttempts = loginAttempts.get(email) || 0;
    loginAttempts.set(email, failedAttempts + 1);
    
    console.log(`❌ Invalid OTP attempt ${failedAttempts + 1} for email: ${email}`);
    
    if (failedAttempts + 1 >= 3) {
      otpStore.delete(email);
      loginAttempts.delete(email);
      return res.status(400).json({ 
        success: false, 
        message: "Too many failed attempts. Please request a new verification code." 
      });
    }
    
    return res.status(400).json({ 
      success: false, 
      message: "Invalid verification code." 
    });
  }

  otpStore.delete(email);
  loginAttempts.delete(email);
  
  console.log(`✅ OTP verified successfully for email: ${email}`);
  
  res.status(200).json({ 
    success: true, 
    message: "Verification successful.",
    userId: stored.userId
  });
});

// ... (keep the rest of your endpoints the same: /send-login-verification, /verify-login, /send-appointment-confirmation, etc.)

// ---------------------------
// ✅ DEDICATED ENDPOINT: Appointment Confirmation (ALTERNATIVE)
// ---------------------------
app.post("/send-appointment-confirmation", async (req, res) => {
  const { email, userId, appointmentDetails } = req.body;

  console.log(`📅 DEDICATED ENDPOINT: Appointment confirmation for ${email}`);

  if (!email) {
    return res.status(400).json({ 
      success: false, 
      message: "Email is required" 
    });
  }

  try {
    const subject = "PetStop - Appointment Confirmed ✅";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header with Logo -->
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #f8732b; margin: 0;">🐾 PetStop Veterinary Clinic</h1>
          <p style="color: #666; margin: 5px 0;">Quality Care for Your Beloved Pets</p>
        </div>

        <!-- Success Banner -->
        <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); 
                    padding: 20px; 
                    border-radius: 10px; 
                    text-align: center; 
                    margin-bottom: 25px;">
          <h2 style="color: white; margin: 0; font-size: 24px;">
            🎉 Your Appointment is Confirmed!
          </h2>
        </div>

        <!-- Greeting -->
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Hello <strong>${userId || "Valued Customer"}</strong>,
        </p>

        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Great news! Your appointment at <strong>PetStop Veterinary Clinic</strong> has been successfully confirmed.
        </p>

        <!-- Appointment Details -->
        ${appointmentDetails ? `
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #f8732b; margin-top: 0;">Appointment Details</h3>
          <p><strong>Date:</strong> ${appointmentDetails.date || 'To be confirmed'}</p>
          <p><strong>Time:</strong> ${appointmentDetails.time || 'To be confirmed'}</p>
          <p><strong>Service:</strong> ${appointmentDetails.service || 'General Consultation'}</p>
          ${appointmentDetails.petName ? `<p><strong>Pet:</strong> ${appointmentDetails.petName}</p>` : ''}
        </div>
        ` : ''}

        <!-- Important Reminders -->
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #856404; margin-top: 0;">⚠️ Important Reminders</h3>
          <ul style="margin: 10px 0; padding-left: 20px; color: #555;">
            <li>Bring your pet's vaccination records</li>
            <li>Ensure your pet is on a leash or in a carrier</li>
            <li>Arrive 10 minutes early for check-in</li>
            <li>Bring payment for the consultation fee</li>
          </ul>
        </div>

        <!-- Footer -->
        <div style="text-align: center; color: #666; margin-top: 30px;">
          <p><strong>🐾 PetStop Veterinary Clinic</strong></p>
          <p>We look forward to seeing you and your furry friend!</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"PetStop Veterinary Clinic" <${process.env.SMTP_USER}>`,
      to: email,
      subject: subject,
      html: html,
    });

    console.log(`✅ DEDICATED ENDPOINT: Appointment confirmation sent to ${email}`);
    res.status(200).json({ 
      success: true, 
      message: "Appointment confirmation email sent successfully." 
    });

  } catch (error) {
    console.error("❌ Error sending appointment confirmation:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send appointment confirmation email." 
    });
  }
});

// ---------------------------
// ✅ TEST ENDPOINT - Use this to test
// ---------------------------
app.post("/test-appointment-email", async (req, res) => {
  try {
    const { email = "test@example.com" } = req.body;
    
    console.log('🧪 TEST: Testing appointment email endpoint');
    
    // Test the main endpoint
    const testResponse = await fetch('http://localhost:3000/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        userId: 'Test User',
        purpose: 'appointment_accepted'
      })
    });

    const result = await testResponse.json();
    console.log('🧪 TEST Result:', result);
    
    res.status(200).json({
      success: true,
      message: "Test completed",
      testResult: result
    });
  } catch (error) {
    console.error('🧪 TEST Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ---------------------------
// ✅ Health Check Endpoint
// ---------------------------
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    service: "PetStop Email Service",
    timestamp: new Date().toISOString(),
    endpoints: [
      "/send-otp - For OTP verification (login, registration, password_reset) AND appointment confirmations",
      "/send-appointment-confirmation - Dedicated endpoint for appointment confirmations",
      "/test-appointment-email - Test endpoint",
      "/verify-otp - For OTP verification",
      "/send-login-verification - For login verification",
      "/verify-login - For login verification"
    ]
  });
});

// ---------------------------
// ✅ Server Startup
// ---------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Email Server running on http://localhost:${PORT}`);
  console.log(`📧 SMTP User: ${process.env.SMTP_USER}`);
  console.log("✅ Email service ready with:");
  console.log("   - OTP verification (login, registration, password_reset)");
  console.log("   - Appointment confirmation emails (NO OTP)");
  console.log("   - Login verification system");
  console.log("");
  console.log("🎯 TEST THE FIX:");
  console.log("   Send POST to http://localhost:3000/test-appointment-email");
  console.log("   Or POST to http://localhost:3000/send-otp with:");
  console.log('   { "email": "user@example.com", "userId": "Test User", "purpose": "appointment_accepted" }');
});