const express = require("express");
const { sendNotification } = require("../controllers/PusherController");
const {
  submitChallengeAnswer,
  assignBadges,
  generateDailyChallenge,
  findTodayChallenge,
  getUserChallengeById,
  getUsersAnswersByChallengeId,
  rankUsersByJob,
  getBadgeById,
  getBadgesByUserId,
} = require("../controllers/Defi");

const router = express.Router();

// Route to trigger a new challenge notification
router.post("/notify", sendNotification);
router.post("/submit-challenge", submitChallengeAnswer);
router.post("/badges", assignBadges);
router.post("/userAnswer/:userChallengeId", getUserChallengeById);
router.post("/generate-challenge", generateDailyChallenge);
router.post("/get-notification", findTodayChallenge);
router.get("/otherSolutions/:challengeId", getUsersAnswersByChallengeId);
router.post("/rank", rankUsersByJob);
router.get("/badge/:id", getBadgeById);
router.get("/badges/:userId", getBadgesByUserId);
module.exports = router;
