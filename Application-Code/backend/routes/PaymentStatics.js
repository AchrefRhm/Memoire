const express = require("express");

const {
  getAnalytics,
  listSubscribers,
  cancelSubscription,
  getUserPaymentHistory,
} = require("../controllers/PaymentStatics");

const PaymentRouter = express.Router();

PaymentRouter.get("/get-analytics", getAnalytics);
PaymentRouter.get("/get-subscribers", listSubscribers);
PaymentRouter.post("/cancel-subscription", cancelSubscription);
PaymentRouter.get("/get-userPaymentHistory/:email", getUserPaymentHistory);
module.exports = PaymentRouter;
