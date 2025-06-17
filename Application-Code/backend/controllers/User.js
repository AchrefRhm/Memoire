const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const Stripe = require("stripe");
const axios = require("axios");
require("dotenv").config();
const { createError } = require("../utils/error.js");
const { generateToken } = require("../config/generateToken.js");
const multer = require("multer");
const path = require("path");
const Payment = require("../models/Payment.js");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();
    res.status(201).send({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      img: newUser.img,
      job: newUser.job,
      token: generateToken(newUser._id),
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found!"));

    if (!user.isActivated) {
      // Account exists, credentials are valid, but not activated
      return res.status(403).json({
        error:
          "Account not activated. Please check your email to activate your account.",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      job: user.job,
      img: user.img,
      isAdmin: user.isAdmin,
      subs: user.subs,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure "uploads" directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage });

// Update User Function
// Updated updateUser function to correctly save image path in database
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(createError(404, "User not found!"));

    // Create update object
    const updateData = {};

    // Handle basic fields
    if (req.body.username) updateData.username = req.body.username;
    if (req.body.email) updateData.email = req.body.email;
    if (req.body.job) updateData.job = req.body.job;

    // Handle Password Update
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(req.body.password, salt);
    }

    // Handle Image Upload - This is the key fix
    if (req.file) {
      // IMPORTANT: Make sure this field name matches your User model schema
      // If your schema uses 'img', 'profilePic', 'avatar', etc. use that instead of 'img'
      updateData.img = `/uploads/${req.file.filename}`;

      console.log("Saving image path to database:", updateData.img);
    }

    console.log("Update data:", updateData);

    // Update User Data
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      console.log("Failed to update user");
      return next(createError(500, "Failed to update user"));
    }

    console.log("User updated successfully:", updatedUser);

    // Don't send password in response
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.status(200).json(userResponse);
  } catch (err) {
    console.error("Error in updateUser:", err);
    next(err);
  }
};
const ActivateSubscription = async (req, res) => {
  try {
    const { email, plan } = req.body;

    if (!email || !plan) {
      return res.status(400).json({ error: "Email and plan are required" });
    }

    // Define plan amounts (in millimes for Flouci)
    const PLAN_AMOUNTS = {
      premium: 19000, // 19.99 TND
      ultimate: 39000, // 39.99 TND
    };

    const amount = PLAN_AMOUNTS[plan];

    if (!amount) {
      return res.status(400).json({ error: "Invalid plan specified" });
    }

    // Flouci Payment Integration
    const url = "https://developers.flouci.com/api/generate_payment";
    const payload = {
      app_token: process.env.APP_TOKEN,
      app_secret: process.env.APP_SECRET,
      amount: amount,
      accept_card: "true",
      session_timeout_secs: 1200,
      success_link: `${process.env.FRONTEND_URL}/checkout/success?plan=${plan}`,
      fail_link: `${process.env.FRONTEND_URL}/checkout/fail`,
      developer_tracking_id: "ee4f767c-f6b3-425b-89d2-4ba54993c5ee",
    };

    const response = await axios.post(url, payload);
    res.json(response.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Failed to initiate payment",
      details: error.message,
    });
  }
};

const ConfirmSubscription = async (req, res) => {
  try {
    const PLAN_AMOUNTS = {
      premium: 19000,
      ultimate: 39000,
    };

    const { email, plan } = req.body;

    if (!email || !plan) {
      return res.status(400).json({ error: "Email and plan are required" });
    }

    const durationInDays = 30;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + durationInDays);

    const user = await User.findOne({ email });
    // const user = await User.findOneAndUpdate(
    //   { email },
    //   {
    //     subs: plan,
    //     subscriptionStart: startDate,
    //     subscriptionEnd: endDate,
    //   },
    //   { new: true }
    // );

    // Record the payment
    const previousPlan = user.subs || "free";
    const amount = PLAN_AMOUNTS[plan];

    const existingPayment = await Payment.findOne({ user: user._id });

    const newHistoryEntry = {
      fromPlan: previousPlan,
      toPlan: plan,
      changedAt: new Date(),
      amount,
    };

    if (existingPayment) {
      existingPayment.history.push(newHistoryEntry);
      await existingPayment.save();
    } else {
      await Payment.create({
        user: user._id,
        email: user.email,
        history: [newHistoryEntry],
      });
    }

    // Update user subscription
    user.subs = plan;
    user.subscriptionStart = startDate;
    user.subscriptionEnd = endDate;
    await user.save();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("ConfirmSubscription error:", error);
    res.status(500).json({ error: "Failed to confirm subscription" });
  }
};

// GET /users/non-admin
const listNonAdminUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
};

// POST /users
const addUser = async (req, res) => {
  try {
    const newUser = new User(req.body); // Ideally validate and hash password here
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to add user." });
  }
};
// PUT /users/:id
const modifyUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user." });
  }
};
// DELETE /users/:id
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user." });
  }
};
// PUT /users/:id/suspend
const suspendUser = async (req, res) => {
  try {
    const suspendedUser = await User.findByIdAndUpdate(
      req.params.id,
      { isActivated: false },
      { new: true }
    );
    res.status(200).json(suspendedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to suspend user." });
  }
};

module.exports = {
  login,
  register,
  updateUser,
  upload,
  ActivateSubscription,
  ConfirmSubscription,
  addUser,
  suspendUser,
  deleteUser,
  modifyUser,
  listNonAdminUsers,
};
