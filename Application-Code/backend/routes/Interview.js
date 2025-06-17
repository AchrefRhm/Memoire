const express = require("express");
const {
  postToGemini,
  getInterviewById,
  saveFeedback,
  getUserAnswersByInterviewId,
  getInterviewsByUserId,
  deleteInterview,
} = require("../controllers/Interview");

const InterviewRouter = express.Router();
InterviewRouter.post("/", postToGemini);
InterviewRouter.post("/saveFeedback", saveFeedback);
InterviewRouter.get("/:id", getInterviewById);
InterviewRouter.get("/userAnswer/:interviewId", getUserAnswersByInterviewId);
InterviewRouter.get("/user/:userId", getInterviewsByUserId);
module.exports = InterviewRouter;
