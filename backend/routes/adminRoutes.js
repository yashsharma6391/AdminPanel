import express from "express";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../middelware/sendEmail.js";

const router = express.Router();

// Allowed admin emails (ONLY owner + you)
const allowedAdmins = [
  process.env.EMAIL_1,
  process.env.EMAIL_2
];

// ------------------------------
// CREATE ADMIN (only owner + you)
// ------------------------------
router.post("/create", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!allowedAdmins.includes(email)) {
      return res.status(403).json({ message: "You are not allowed to create admin" });
    }

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      email,
      password: hashPassword
    });

    res.status(201).json({ message: "Admin created", admin: newAdmin });

  } catch (err) {
    res.status(500).json({ message: "Error creating admin", error: err });
  }
});

// ------------------------------
// ADMIN LOGIN
// ------------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid email" });

    const validPass = await bcrypt.compare(password, admin.password);
    if (!validPass) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // send token as cookie
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });

    res.json({ message: "Login successful" });

  } catch (err) {
    res.status(500).json({ message: "Error in login", error: err });
  }
});

// ------------------------------
// MIDDLEWARE TO PROTECT ROUTES
// ------------------------------
export async function adminAuth(req, res, next) {
  const token = req.cookies?.adminToken;

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      // return res.status(404).json({ message: "Admin not found" });
       res.clearCookie("adminToken", { httpOnly: true, secure: true, sameSite: "none" });
      return res.status(404).json({ message: "Admin not found" });
    }
    
    req.adminId = decoded.id;
     req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

// ------------------------------
// PROTECTED ROUTE TEST
// ------------------------------
router.get("/check", adminAuth, async (req, res) => {
  try {
    // Verify admin still exists in database
    const admin = await Admin.findById(req.adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found - deleted" });
    }
    res.json({ message: "Admin verified" });
  } catch (err) {
    res.status(500).json({ message: "Error verifying admin" });
  }
});

// ------------------------------
// LOGOUT
// ------------------------------
router.get("/logout", (req, res) => {
  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.json({ message: "Logged out successfully" });
});
// ------------------- FORGOT PASSWORD -------------------
router.post("/forgot-password", async (req, res) => {
   try {
     const { email } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(400).json({ message: "Admin not found" });

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  admin.resetPasswordToken = hashedToken;
  admin.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await admin.save();

  const resetURL = `${process.env.ADMIN_URL}/reset-password/${resetToken}`;

  await sendEmail(
    admin.email,
    "Admin Reset Password",
    `Reset your password using this link: ${resetURL}`
  );

  return res.json({ message: "Reset password link sent to email" });
   } catch (error) {
    res.status(500).json({ message: "Server error", error: err });
   }
});
  
//   const { email } = req.body;

//   const admin = await Admin.findOne({ email });
//   if (!admin) return res.status(400).json({ message: "Admin not found" });

//   const resetToken = crypto.randomBytes(32).toString("hex");
//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//   admin.resetPasswordToken = hashedToken;
//   admin.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
//   await admin.save();

//   const resetURL = `${process.env.ADMIN_URL}/reset-password/${resetToken}`;

//   await sendEmail(
//     admin.email,
//     "Admin Reset Password",
//     `Reset your password using this link: ${resetURL}`
//   );

//   return res.json({ message: "Reset password link sent to email" });
// });


// ------------------- RESET PASSWORD -------------------
router.put("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "newPassword is required" });
    }

    // hash the token coming from frontend
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // correct field
    });

    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // update password
    const hashed = await bcrypt.hash(newPassword, 10);
    admin.password = hashed;

    // remove reset token fields
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;

    await admin.save();

    res.json({ message: "Password reset successfully" });

  } catch (error) {
    // console output removed for production
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/exists", async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    // If count > 0, admin exists
     res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
    res.set("Surrogate-Control", "no-store");
    res.json({ adminExists: count > 0 });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

export default router;
