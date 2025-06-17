const express = require("express");
const {
  generateQuiz,
  getQuizzesByUserId,
  getQuizById,
  submitQuiz,
  getQuizAnswerById,
  deleteQuiz,
  updateQuiz,
} = require("../controllers/Quiz");

const QuizRouter = express.Router();
QuizRouter.post("/", generateQuiz);
QuizRouter.post("/get-quizez", getQuizzesByUserId);
QuizRouter.get("/get-quiz/:id", getQuizById);
QuizRouter.post("/submit", submitQuiz);
QuizRouter.get("/get-userQuizAnswer/:id", getQuizAnswerById);
QuizRouter.delete("/delete/:id", deleteQuiz);

module.exports = QuizRouter;
