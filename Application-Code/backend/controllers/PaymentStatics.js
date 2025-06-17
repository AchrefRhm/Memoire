const Payment = require("../models/Payment"); // Adjust the path as needed
const User = require("../models/User");

const getAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfWeek = new Date(now);
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const totalSubscribers = await User.aggregate([
      {
        $group: {
          _id: "$subs", // group by the current subscription plan
          count: { $sum: 1 },
        },
      },
    ]);

    const revenues = await Payment.aggregate([
      { $unwind: "$history" },
      {
        $facet: {
          daily: [
            { $match: { "history.changedAt": { $gte: startOfToday } } },
            { $group: { _id: null, total: { $sum: "$history.amount" } } },
          ],
          weekly: [
            { $match: { "history.changedAt": { $gte: startOfWeek } } },
            { $group: { _id: null, total: { $sum: "$history.amount" } } },
          ],
          monthly: [
            { $match: { "history.changedAt": { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: "$history.amount" } } },
          ],
        },
      },
    ]);

    const revenuePerMonth = await Payment.aggregate([
      { $unwind: "$history" },
      {
        $group: {
          _id: {
            year: { $year: "$history.changedAt" },
            month: { $month: "$history.changedAt" },
          },
          total: { $sum: "$history.amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const weeklyNewSubs = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            week: { $isoWeek: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.week": 1 },
      },
    ]);

    const growthCurve = await Payment.aggregate([
      { $unwind: "$history" },
      {
        $group: {
          _id: {
            plan: "$history.toPlan",
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$history.changedAt" },
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]);

    const monthComparison = await Payment.aggregate([
      { $unwind: "$history" },
      {
        $facet: {
          currentMonth: [
            { $match: { "history.changedAt": { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: "$history.amount" } } },
          ],
          lastMonth: [
            {
              $match: {
                "history.changedAt": {
                  $gte: startOfLastMonth,
                  $lte: endOfLastMonth,
                },
              },
            },
            { $group: { _id: null, total: { $sum: "$history.amount" } } },
          ],
        },
      },
    ]);

    const revenueByPlan = await Payment.aggregate([
      { $unwind: "$history" },
      { $match: { "history.toPlan": { $ne: "free" } } },
      {
        $group: {
          _id: "$history.toPlan",
          total: { $sum: "$history.amount" },
        },
      },
    ]);

    return res.status(200).json({
      totalSubscribers,
      revenues: {
        daily: revenues[0]?.daily[0]?.total || 0,
        weekly: revenues[0]?.weekly[0]?.total || 0,
        monthly: revenues[0]?.monthly[0]?.total || 0,
      },
      revenuePerMonth,
      weeklyNewSubs,
      growthCurve,
      monthComparison: {
        current: monthComparison[0]?.currentMonth[0]?.total || 0,
        previous: monthComparison[0]?.lastMonth[0]?.total || 0,
      },
      revenueByPlan,
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve analytics", error: error.message });
  }
};

const listSubscribers = async (req, res) => {
  try {
    // Get users with active subscription (not 'free')
    const users = await User.find(
      { subs: { $ne: "free" } },
      "username img email subs subscriptionStart subscriptionEnd"
    );

    // Join with latest payment history (optional)
    const payments = await Payment.find({
      email: { $in: users.map((u) => u.email) },
    });

    // Combine data
    const enriched = users.map((user) => {
      const payment = payments.find((p) => p.email === user.email);
      return {
        ...user.toObject(),
        latestPayment: payment?.history?.[payment.history.length - 1] || null,
      };
    });

    res.json(enriched);
  } catch (error) {
    console.error("Error listing subscribers:", error);
    res.status(500).json({ error: "Failed to fetch subscribers" });
  }
};

const cancelSubscription = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const previousPlan = user.subs;

    // Update user subscription
    user.subs = "free";
    user.subscriptionStart = null;
    user.subscriptionEnd = null;
    await user.save();

    // Record cancellation in payment history
    await Payment.findOneAndUpdate(
      { email },
      {
        $push: {
          history: {
            fromPlan: previousPlan,
            toPlan: "free",
            amount: 0,
          },
        },
      },
      { upsert: true }
    );

    res.json({ message: "Subscription cancelled", user });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    res.status(500).json({ error: "Failed to cancel subscription" });
  }
};

// GET /api/payments/:email
const getUserPaymentHistory = async (req, res) => {
  try {
    const { email } = req.params;

    const payment = await Payment.findOne({ email }).populate(
      "user",
      "username"
    );

    if (!payment) {
      return res.status(404).json({ error: "No payment history found" });
    }

    res.json({
      username: payment.user.username,

      email: payment.email,
      history: payment.history,
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({ error: "Failed to get payment history" });
  }
};

module.exports = {
  getAnalytics,
  listSubscribers,
  cancelSubscription,
  getUserPaymentHistory,
};
