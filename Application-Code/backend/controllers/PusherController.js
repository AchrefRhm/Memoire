const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "APP_ID",
  key: "API_KEY",
  secret: "SECRET",
  cluster: "eu",
  useTLS: true,
});

const sendNotification = async (req, res) => {
  try {
    const { message } = req.body;
    await pusher.trigger("challenges", "new-challenge", { message });

    res.status(200).json({ success: true, message: "Notification sent!" });
  } catch (error) {
    console.error("Pusher error:", error);
    res.status(500).json({ success: false, message: "Notification failed" });
  }
};
module.exports = { sendNotification };
