const express = require("express");
const {
  login,
  register,
  updateUser,
  upload,
  ActivateSubscription,
  testPayment,
  ConfirmSubscription,
  listNonAdminUsers,
  addUser,
  modifyUser,
  deleteUser,
  suspendUser,
} = require("../controllers/User");

const router = express.Router();

// Register a new user
router.post("/register", register);

// Login an existing user
router.post("/login", login);
router.put("/updateProfile", updateUser);
router.put("/updateProfile/:id", upload.single("profileImage"), updateUser);
router.post("/subscriptions/activate", ActivateSubscription);
router.post("/subscriptions/confirm", ConfirmSubscription);
router.get("/list-users", listNonAdminUsers);
router.post("/addUser", addUser);
router.put("/update-user/:id", modifyUser);
router.delete("/delete-user/:id", deleteUser);
router.put("/toggle-activation/:id", suspendUser);
module.exports = router;
